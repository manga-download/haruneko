// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './VizShonenJump.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { Fetch, FetchCSS, FetchHTML, FetchWindowScript } from '../../platform/FetchProvider';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';
import exifr from 'exifr';
import DeScramble from '../../transformers/ImageDescrambler';

type UserInfos = {
    isLoggedIn: boolean,
    isAdult: boolean,
    isMember: boolean,
    isVizManga: boolean
}

type PagesInfos = {
    pagesCount: number,
    mangaID: string
}

type ExifData = {
    ImageUniqueID: string,
    ImageWidth: number,
    ImageHeight: number
}

const UserInfoScript = `
    new Promise ( resolve => {
        resolve({
            isLoggedIn : /[1-9]+/.test(user_id),
            isAdult : adult === true,
            isMember : is_sj_subscriber === true,
            isVizManga : is_vm_subscriber === true
        });
    });
`;

const PagesScript = `
    new Promise ( resolve => {
        resolve({
            pagesCount : pages,
            mangaID : mangaCommonId ?? currentMCid
        });
    });
`;

export default class extends DecoratableMangaScraper {
    private userInfos: UserInfos;

    public constructor() {
        super('vizshonenjump', `Viz - Shonen Jump`, 'https://www.viz.com' /*, Tags.Language.English, Tags ... */);
        //this.imageTaskPool.RateLimit = new RateLimit(1, 0.5);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await this.GetMangasAvailableByVolumes(provider),
            ...await this.GetMangasAvailableByChapters(provider),
            ...await this.GetMangasAvailableByVizMangaChapters(provider)
        ].distinct();
    }

    private async GetMangasAvailableByVolumes(provider: MangaPlugin): Promise<Manga[]> {
        const dom = await FetchHTML(new Request(new URL('/account/library', this.URI)));
        if (dom.documentElement.innerText.includes('Log in to view your library')) { // User isn't logged in, so there's no availible volumes
            return [];
        }
        return [...dom.querySelectorAll<HTMLAnchorElement>('table.purchase-table a')].map(manga => new Manga(this, provider, manga.pathname, manga.innerText.trim()));
    }

    private async GetMangasAvailableByChapters(provider: MangaPlugin): Promise<Manga[]> {
        const dom = await FetchHTML(new Request(new URL('/read/shonenjump/section/free-chapters', this.URI)));
        if (!dom.documentElement.innerText.includes('Latest free chapters')) { //'This website is geolocked. It can only be accessed from the USA.\nYou may use MANGA Plus instead.
            return [];
        }
        return [...dom.querySelectorAll<HTMLAnchorElement>('div.o_sort_container div.o_sortable a.o_chapters-link')]
            .map(manga => new Manga(this, provider, manga.pathname, manga.innerText.trim()));
    }

    private async GetMangasAvailableByVizMangaChapters(provider: MangaPlugin): Promise<Manga[]> {
        const dom = await FetchHTML(new Request(new URL('/read/vizmanga/section/free-chapters', this.URI)));
        if (!dom.documentElement.innerText.includes('Latest free chapters')) { //'This website is geolocked. It can only be accessed from the USA.\nYou may use MANGA Plus instead.
            return [];
        }
        return [...dom.querySelectorAll<HTMLAnchorElement>('div.o_sort_container div.o_sortable a.o_chapters-link')].map(manga => new Manga(this, provider, manga.pathname, manga.innerText.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        await this.GetUserInfos();
        if (manga.Identifier.startsWith('/shonenjump/chapters')) {
            return await this.GetChapters(manga, this.userInfos.isMember);
        }
        if (manga.Identifier.startsWith('/vizmanga/chapters')) {
            return await this.GetChapters(manga, this.userInfos.isVizManga);
        }
        if (manga.Identifier.startsWith('/account/library')) {
            return await this.GetMangaVolumes(manga);
        }

        throw new Error(`Failed to get chapters/volumes for manga ${manga.Identifier}, because the manga type is not supported!`);
    }

    private async GetChapters(manga: Manga, hasAccess: boolean): Promise<Chapter[]> {
        let chapters = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'div > a.o_chapter-container[data-target-url], tr.o_chapter td.ch-num-list-spacing a.o_chapter-container[data-target-url]');
        return chapters
            .filter(element => {
                if (/javascript:.*join/i.test(element.href)) {
                    return hasAccess;
                }
                // free
                return true;
            })
            .map(chapter => {
                const targetUrl = /javascript/.test(chapter.dataset.targetUrl) ? chapter.dataset.targetUrl.match(/['"](\/shonenjump[^']+)['"]/)[1] : chapter.dataset.targetUrl;
                const formatNode = chapter.querySelector<HTMLElement>('.disp-id');
                if (formatNode) {
                    return new Chapter(this, manga, targetUrl, formatNode.innerText.trim());
                }

                const format = chapter.dataset.targetUrl.match(/chapter-([-_0-9]+)\//);
                if (format && format.length > 1) {
                    return new Chapter(this, manga, targetUrl, 'Ch. ' + format[1].replace(/[-_]/g, '.'));
                }

                throw new Error(`Unknown chapter format for ${targetUrl}. Please report at https://github.com/manga-download/hakuneko/issues`);
            });
    }

    private async GetMangaVolumes(manga: Manga): Promise<Chapter[]> {
        const dom = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));

        const volumeNames = [...dom.querySelectorAll<HTMLElement>('#o_products tr td:nth-child(3)')]
            .map(volume => {
                return volume.innerText;
            });

        const firstVolumeName = volumeNames[0].substring(0, volumeNames[0].indexOf("Vol."));
        const allNamesMatch = volumeNames.every(volume => volume.startsWith(firstVolumeName));

        let volumes = [...dom.querySelectorAll<HTMLAnchorElement>('#o_products tr td:last-of-type a')]
            .map(volume => {
                return new Chapter(this, manga, new URL(volume.href, this.URI).pathname, 'Vol. ' + volume.href.match(/-volume-([-_0-9]+)/i)[1]);
                //id: this.getRootRelativeOrAbsoluteLink(volume, this.url).substring(1),
                //title:
                //};
            });

        // We're dealing with a manga that contains multiple subseries, so we must give each volume the full name provided or else
        // the user won't be able to differentiate between series, and would have conflicting volume numbers.
        if (!allNamesMatch) {
            for (let i = 0; i < volumes.length; i++) {
                volumes[i] = new Chapter(this, manga, volumes[i].Identifier, volumeNames[i]);
            }
        }
        return volumes;
    }

    private async GetUserInfos() {
        this.userInfos = await FetchWindowScript<UserInfos>(new Request(new URL('/account/refresh_login_links', this.URI)), UserInfoScript);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI);
        const { pagesCount, mangaID } = await FetchWindowScript<PagesInfos>(new Request(chapterurl), PagesScript);

        const pages = Array(pagesCount+1).fill(0).map((_, index) => {
            const url = new URL('/manga/get_manga_url', this.URI);
            url.searchParams.set('device_id', '3');
            url.searchParams.set('manga_id', mangaID);
            url.searchParams.set('page', index.toString());
            return new Page(this, chapter, url, { Referer: chapterurl.href });
        });

        return pages;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const response = await Fetch(new Request(page.Link, {
            signal,
            headers: {
                Referer: page.Parameters.Referer,
                Origin: this.URI.origin,
            }
        }));

        const img_url = await response.text();
        const buffer = await this.FetchBuffer(img_url, priority, signal, page.Parameters.Referer);
        const tags: ExifData = await exifr.parse(buffer);

        const width = tags.ImageWidth;
        const height = tags.ImageHeight;
        const shuffleMap = tags.ImageUniqueID.split(':');

        return DeScramble(new ImageData(width, height), async (_, ctx) => {
            const EXIFWIDTH = width;
            const EXIFHEIGHT = height;

            const blob = await Common.GetTypedData(buffer);
            const bitmap = await createImageBitmap(blob);

            let x_split = Math.floor(EXIFWIDTH / 10),
                y_split = Math.floor(EXIFHEIGHT / 15);

            ctx.clearRect(0, 0, EXIFWIDTH, EXIFHEIGHT);

            ctx.drawImage(bitmap, 0, 0, EXIFWIDTH, y_split, 0, 0, EXIFWIDTH, y_split);
            ctx.drawImage(bitmap, 0, y_split + 10, x_split, EXIFHEIGHT - 2 * y_split, 0, y_split, x_split, EXIFHEIGHT - 2 * y_split);
            ctx.drawImage(
                bitmap,
                0,
                14 * (y_split + 10),
                EXIFWIDTH,
                bitmap.height - 14 * (y_split + 10),
                0,
                14 * y_split,
                EXIFWIDTH,
                bitmap.height - 14 * (y_split + 10)
            );
            ctx.drawImage(bitmap, 9 * (x_split + 10), y_split + 10, x_split + (EXIFWIDTH - 10 * x_split), EXIFHEIGHT - 2 * y_split, 9 * x_split, y_split, x_split + (EXIFWIDTH - 10 * x_split), EXIFHEIGHT - 2 * y_split);

            for (let m = 0; m < shuffleMap.length; m++) {
                const piecevalue = parseInt(shuffleMap[m], 16);
                ctx.drawImage(
                    bitmap,
                    Math.floor((m % 8 + 1) * (x_split + 10)),
                    Math.floor((Math.floor(m / 8) + 1) * (y_split + 10)),
                    Math.floor(x_split),
                    Math.floor(y_split),
                    Math.floor((piecevalue % 8 + 1) * x_split),
                    Math.floor((Math.floor(piecevalue / 8) + 1) * y_split),
                    Math.floor(x_split),
                    Math.floor(y_split)
                );
            }

        });

    }

    private async FetchBuffer(url: string, priority: Priority, signal: AbortSignal, referer: string): Promise<ArrayBuffer> {
        const response = await Fetch(new Request(url, {
            signal,
            headers: {
                Referer: referer,
                Origin: this.URI.origin,
                crossOrigin: 'Anonymous'
            }
        }));
        return await response.arrayBuffer();
    }
}
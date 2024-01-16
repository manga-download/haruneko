import { Tags } from '../Tags';
import icon from './MangaTales.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as GManga from './decorators/GManga';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

const apiUrl = 'https://mangatales.com/';

type APIChapters = {
    mangaReleases: {
        team_id: number,
        teams: {
            id: number,
            name: string
        }[],
        volume: number,
        title: string,
        chapter: number
    }[]
}

type APIPages = {
    globals: {
        pageUrl: string,
        wla: {
            configs: {
                http_media_server: string,
                media_server: string
            }
        }
    },
    readerDataAction: {
        readerData: {
            release: {
                hq_pages: string,
                mq_pages: string,
                lq_pages : string
            }
        }
    }
}

@GManga.MangaCSS(/^{origin}\/mangas\/\d+\/[^/]+$/)
@GManga.MangasMultiPageAJAX(apiUrl)
@GManga.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatales', `MangaTales`, 'https://mangatales.com', Tags.Language.Arabic, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/api/mangas/${manga.Identifier}`, apiUrl).href);
        const response = await FetchJSON<GManga.APIResult> (request);
        const strdata = response.iv ? await GManga.decrypt(response.data) : JSON.stringify(response);
        const tmpdata: GManga.packedData | APIChapters = JSON.parse(strdata);
        const chapters: APIChapters = (tmpdata as GManga.packedData).isCompact ? GManga._unpack(tmpdata as GManga.packedData) as APIChapters : tmpdata as APIChapters;
        return chapters.mangaReleases.map(chapter => {
            const team = chapter.teams.find(t => t.id === chapter.team_id);
            let title = 'Vol.' + chapter.volume + ' Ch.' + chapter.chapter;
            title += chapter.title ? ' - ' + chapter.title : '';
            title += team.name ? ' [' + team.name + ']' : '';
            //url format /mangas/<mangaid>/anything/<chapterNumber>
            const id = [manga.Identifier, manga.Title, chapter.chapter].join('/');
            return new Chapter(this, manga, id, title);
        });

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/mangas/${chapter.Identifier}`, this.URI).href);
        const response = await FetchCSS(request, 'script[data-component-name="HomeApp"]');
        const data: APIPages = JSON.parse(response[0].textContent);

        const url = (data.globals.wla.configs.http_media_server || data.globals.wla.configs.media_server) + '/uploads/releases/';
        let images: string[] = [];

        if (data.readerDataAction.readerData.release.hq_pages && data.readerDataAction.readerData.release.hq_pages.length > 0) {
            images = data.readerDataAction.readerData.release.hq_pages.split('\r\n');
        } else if (data.readerDataAction.readerData.release.mq_pages && data.readerDataAction.readerData.release.mq_pages.length > 0) {
            images = data.readerDataAction.readerData.release.mq_pages.split('\r\n');
        } else if (data.readerDataAction.readerData.release.lq_pages && data.readerDataAction.readerData.release.lq_pages.length > 0) {
            images = data.readerDataAction.readerData.release.lq_pages.split('\r\n');
        }

        return images.map(image => {
            const uri = new URL(url, request.url);
            uri.pathname += image;
            return new Page(this, chapter, uri);
        });
    }
}
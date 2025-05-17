//Comici.jp viewer based websites : BigComics, YoungChampion, YoungAnimal, ComicMedu, ComicRide

import { Exception } from '../../Error';
import { FetchCSS, FetchJSON } from '../../platform/FetchProvider';
import { Page, Chapter, Manga, DecoratableMangaScraper, type MangaPlugin } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import DeScramble from '../../transformers/ImageDescrambler';
import * as Common from '../decorators/Common';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';

type APIResult<T> = {
    result: T,
    totalPages: number
}

type APIPage = {
    imageUrl: string,
    scramble: string
}

type ScrambleData = {
    scramble: string
}

function StripTrailingDash(text: string): string {
    return text.replace(/\/$/, '');
}
function MangaInfoExtractor(element: HTMLElement) {
    return {
        id: StripTrailingDash(element.querySelector('a').pathname),
        title: element.querySelector('h2.title-text').textContent.trim()
    };
}

function ChapterExtractor(element: HTMLElement) {
    return {
        id: new URL(element.dataset['href']).pathname,
        title: element.querySelector<HTMLSpanElement>('span.series-ep-list-item-h-text').textContent.trim()
    };
}

@Common.MangasMultiPageCSS('/series/list?page={page}', 'div.series-box-vertical', 0, 1, 0, MangaInfoExtractor)
export class ComiciViewer extends DecoratableMangaScraper {

    protected mangaRegexp = /\/series\/[^/]+(\/)?$/;//same website can provide manga links with and without trailing slash
    private readonly scrambleMatrix = new Array(16).fill(null).map((_, index) => [index / 4 >> 0, index % 4 >> 0]);

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url) && url.startsWith(this.URI.origin);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const [title] = await FetchCSS<HTMLHeadingElement>(new Request(mangaUrl), 'h1.series-h-title span:not([class])');
        return new Manga(this, provider, StripTrailingDash(mangaUrl.pathname), title.textContent.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}/list`, this.URI)), 'div.series-ep-list a[data-href]' );
        return data.map(element => {
            const { id, title } = ChapterExtractor.call(this, element);
            return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        const [viewer] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), '#comici-viewer');
        if (!viewer) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);

        const { result } = await this.FetchCoordInfo(viewer.getAttribute('comici-viewer-id'), viewer.dataset['memberJwt'], chapter);
        return result.map(image => new Page<ScrambleData>(this, chapter, new URL(image.imageUrl), { scramble: image.scramble, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters?.scramble ? data : DeScramble(data, async (image, ctx) => {

            const decodedArray = this.DecodeScrambleArray(page.Parameters.scramble);
            const tileWidth = Math.floor(image.width / 4);
            const tileHeight = Math.floor(image.height / 4);
            for (let k = 0, i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    ctx.drawImage(image, tileWidth * decodedArray[k][0], tileHeight * decodedArray[k][1], tileWidth, tileHeight, tileWidth * i, tileHeight * j, tileWidth, tileHeight);
                    k++;
                }
            }
        });
    }

    private async FetchCoordInfo(viewerId: string, userId: string, chapter: Chapter): Promise<APIResult<APIPage[]>> {
        //first request get page count
        const { totalPages } = await FetchJSON<APIResult<APIPage[]>>(this.CreateChapterRequest('1', viewerId, userId, chapter));
        //second request fetch actual pages data
        return FetchJSON<APIResult<APIPage[]>>(this.CreateChapterRequest(totalPages.toString(), viewerId, userId, chapter));
    }

    private CreateChapterRequest(pageTo: string, viewerId: string, userId: string, chapter: Chapter): Request {
        return new Request(new URL(`/book/contentsInfo?comici-viewer-id=${viewerId}&user-id=${userId}&page-from=0&page-to=${pageTo}`, this.URI), {
            headers: {
                Origin: this.URI.origin,
                Referer: new URL(chapter.Identifier, this.URI).href
            }
        });
    }

    private DecodeScrambleArray(scramble: string): number[][] {
        const decoded: number[][] = [];
        const encoded = scramble.replace(/\s+/g, '').slice(1).slice(0, -1).split(',');
        for (let i = 0; i < this.scrambleMatrix.length; i++) {
            decoded.push(this.scrambleMatrix[encoded[i]]);
        }
        return decoded;
    }
}
import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaPlugin, type Manga, Chapter, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

export const queryMangaTitle = 'ul.manga-info :is(h1, h3), .manga-main-title';
export const MangasLinkGenerator = Common.PatternLinkGenerator<MangaPlugin>('/manga-list.html?page={page}');
export const queryMangas = 'div.series-title a, a.manga-title';
export const queryChapters = 'ul.list-chapters > a';
export const queryPages = 'img.chapter-img';
export function ClipBoardExtractor(element: HTMLElement, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanTitle(element.dataset?.enc ? window.atob(element.dataset?.enc) : element.textContent)
    };
}

export function AnchorExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.title || anchor.text || anchor.textContent)
    };
}
export function CleanTitle(title: string): string {
    return title.replace(/\(Manga\)/i, '').trim().replace(/- RAW/i, '').trim();
}

type SlugExtractor = (mangaId: string) => string;

@Common.MangasMultiPageCSS(queryMangas, MangasLinkGenerator, 0, AnchorExtractor)
@Common.PagesSinglePageCSS(queryPages)
@Common.ImageAjax()
export class FlatManga extends DecoratableMangaScraper {
    private chapterEndpoint: string = undefined;
    private MangaSlugExtractor: SlugExtractor = (mangaId: string) => mangaId.match(/\/[a-zA-Z0-9]+-([^/]+)\.html/).at(-1);

    public WithChapterAjaxEndpoint(endpoint: string): FlatManga {
        this.chapterEndpoint = endpoint;
        return this;
    }

    public WithMangaSlugExtractor(extractor: SlugExtractor): FlatManga {
        this.MangaSlugExtractor = extractor;
        return this;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const uri = new URL(this.chapterEndpoint.replace('{manga}', this.MangaSlugExtractor(manga.Identifier)), this.URI);
        const init = {
            method: 'POST',
            headers: {
                'Referer': new URL(manga.Identifier, this.URI).href,
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: '',
        };

        for (let page = 1, run = true; run; page++) {
            init.body = `page=${page}`;
            const links = await FetchCSS<HTMLAnchorElement>(new Request(uri, init), queryChapters);
            const chapters = links.map(link => new Chapter(this, manga, link.pathname, (link.title.trim() || link.text.trim()).replace(manga.Title, '').trim()));
            chapterList.isMissingLastItemFrom(chapters) ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }
}
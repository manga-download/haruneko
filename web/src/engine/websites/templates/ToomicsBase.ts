import { FetchCSS } from "../../platform/FetchProvider";
import { type MangaScraper, type MangaPlugin, type Manga, Chapter, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from "../decorators/Common";

export function WebsiteInfoExtractor(appendLanguage: boolean = true) {
    return function (this: MangaScraper, titleElement: HTMLElement, url: URL) {
        const language = ExtractLanguage(url.pathname);
        return {
            id: url.pathname,
            title: [titleElement.dataset.toonName?.trim() ?? titleElement.textContent.trim(), appendLanguage ? `[${language}]` : ''].join(' ').trim()
        };
    };
};
function MangaInfoExtractor(appendLanguage: boolean = true) {
    return function (this: MangaScraper, element: HTMLAnchorElement) {
        const language = ExtractLanguage(element.pathname);
        const title = (element.querySelector('h4.title, h4') ?? element).textContent.trim();
        return {
            id: element.pathname,
            title: appendLanguage ? [title, `[${language}]`].join(' ').trim() : title
        };
    };
};

function ExtractLanguage(text: string): string {
    return text.match(/^\/([a-z]{2,3})\//)?.at(1) ?? '';
};

export function PageExtractor(element: HTMLImageElement) {
    return element.dataset.original || element.dataset.src || element.getAttribute('src') || '';
}

@Common.PagesSinglePageCSS('#viewer-img img', PageExtractor)
@Common.ImageAjax(true)
export class ToomicsBase extends DecoratableMangaScraper {
    protected languages: string[] = ['en'];
    protected mangaPath = '/{language}/webtoon/ranking';
    protected queryMangas = 'div.list-wrap ul li a, div.list_wrap ul li a';
    protected queryChapters = 'ol.list-ep li.normal_ep a, ul.ep__list li a';
    protected queryChapterTitle = 'div.cell-title strong, div.ep__name';
    protected queryChapterNum = 'div[class*="ep__turning"], div.cell-num';
    protected customChapterUrlPattern: RegExp = undefined;

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        for (const language of this.languages) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, this.mangaPath.replace('{language}', language), this.queryMangas, MangaInfoExtractor(this.languages.length > 1));
            mangalist.push(...mangas);
        }
        return mangalist.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const nodes = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), this.queryChapters);
        const mangaTitle = this.languages.length > 1 ? manga.Title.replace(/\[.*\]$/, '').trim() : manga.Title;
        return nodes.map(anchor => {

            const chaptertitle = anchor.querySelector(this.queryChapterTitle).textContent.trim();
            const chapterNum = anchor.querySelector(this.queryChapterNum).textContent.trim();
            const title = [chapterNum, chaptertitle].join(' ').trim();

            //First try to build matching url from dataset element if they exists
            let id = '';
            const lang = ExtractLanguage(manga.Identifier);

            if (anchor.dataset.e && anchor.dataset.c && anchor.dataset.v) {
                id = lang ? `/${lang}` : '';
                id += `/webtoon/detail/code/${window.atob(anchor.dataset.c)}/ep/${window.atob(anchor.dataset.v)}/toon/${window.atob(anchor.dataset.e)}`;
            }
            else {
                //look for url pattern in "onclick"
                const action = anchor.getAttribute('onclick');
                const regexp = this.customChapterUrlPattern ? this.customChapterUrlPattern : lang ? new RegExp(`/${lang}/webtoon/detail/code/\\d+/ep/\\d+/toon/\\d+`) : new RegExp(`/webtoon/detail/code/\\d+/ep/\\d+/toon/\\d+`);
                id = action?.match(regexp)?.at(0);
            }
            return new Chapter(this, manga, new URL(id ?? anchor.pathname, this.URI).pathname, title.replace(mangaTitle, '').trim());
        });
    }
}
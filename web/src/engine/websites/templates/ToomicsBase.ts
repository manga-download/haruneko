import { FetchCSS } from "../../platform/FetchProvider";
import { type MangaScraper, type MangaPlugin, type Manga, Chapter, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from "../decorators/Common";

export function WebsiteInfoExtractor(appendLanguage: boolean = true) {
    return function (this: MangaScraper, titleElement: HTMLElement, url: URL) {
        const language = ExtractLanguage(url.pathname);
        return {
            id: url.pathname,
            title: [titleElement.dataset.toonName?.trim() ?? titleElement.textContent.trim(), appendLanguage ? `[${language}]`: ''].join(' ').trim()
        };
    };
};

export function MangaInfoExtractor(appendLanguage: boolean = true) {
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
    return text.match(/\/([a-z]{2,3})\//).at(1);
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
        const mangaTitle = this.languages.length > 1 ? manga.Title.replace(/\[.*\]$/, '').trim(): manga.Title;
        return nodes.map(anchor => {

            const chaptertitle = anchor.querySelector('div.cell-title strong, div.ep__name').textContent.trim();
            const chapterNum = anchor.querySelector('div[class*="ep__turning"], div.cell-num').textContent.trim();
            const title = [chapterNum, chaptertitle].join(' ').trim();

            //url extractor
            const action = anchor.getAttribute('onclick');
            let id = action.match(/location\.href\s*=\s*'([^']+)/)?.at(1) ?? action.match(/popupLogin\('([^']+)/)?.at(1) ?? anchor.href;

            if (/javascript/.test(id)) {
                const lang = ExtractLanguage(manga.Identifier);
                id = `/${lang}/webtoon/detail/code/${window.atob(anchor.dataset.c)}/ep/${window.atob(anchor.dataset.v)}/toon/${window.atob(anchor.dataset.e)}`;
            }

            return new Chapter(this, manga, new URL(id, this.URI).pathname, title.replace(mangaTitle, '').trim());
        });
    }
}
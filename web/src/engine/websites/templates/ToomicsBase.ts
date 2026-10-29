import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, type Manga, Chapter, DecoratableMangaScraper, type Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { GetBytesFromBase64, GetUTF8FromBytes } from "../../BufferEncoder";

export const queryMangaTitle = 'section a[data-toon-name], h3[class*="episode-top__tit"], div.title_content h2.episode-title';
const queryMangas = 'div.list-wrap ul li a, div.list_wrap ul li a, ul li a[href*="/webtoon/episode/toon/"]';
const queryChapters = 'ol.list-ep li.normal_ep a, ul.ep__list li a, div.episode__body ul.eps li a';
const queryChapterTitle = 'div.cell-title strong, div.ep__name, div.ep__episode';
const queryChapterNum = 'div[class*="ep__turning"], div.cell-num, strong.ep__title';
const queryPages = '#viewer-img img, div.viewer__img img';

export function WebsiteInfoExtractor(element: HTMLElement, url: URL) {
    return {
        id: url.pathname,
        title: [element.dataset.toonName?.trim() ?? element.textContent.trim(), `[${ExtractLanguageFromPathName(url.pathname)}]`].joinTitleSegments()
    };
};

function MangaInfoExtractor(element: HTMLAnchorElement) {
    const title = (element.querySelector('h4.title, h4') ?? element).textContent.trim();
    return {
        id: element.pathname,
        title: [title, this.languages.length > 1 ? `[${ExtractLanguageFromPathName(element.pathname)}]`: ''].joinTitleSegments()
    };
};

function ExtractLanguageFromPathName(pathName: string): string {
    return pathName.match(/^\/([a-z]{2,3})\//)?.at(1) ?? '';
};

function PageExtractor(element: HTMLImageElement) {
    return element.dataset.original || element.dataset.src || element.getAttribute('src') || '';
}

@Common.MangaCSS(/^{origin}\/[a-z]+\/webtoon\/episode\/toon\/\d+$/, queryMangaTitle, WebsiteInfoExtractor)
@Common.ImageAjax(true)
export class ToomicsBase extends DecoratableMangaScraper {
    private languages: string[] = ['en'];
    private mangaPath = '/{language}/webtoon/ranking';
    private customChapterUrlPattern: RegExp = undefined;

    public SetLanguages(languages: string[]): ToomicsBase {
        this.languages = languages;
        return this;
    }

    public WithMangasPath(mangaPath: string): ToomicsBase {
        this.mangaPath = mangaPath;
        return this;
    }

    public WithChapterUrlPattern(customChapterUrlPattern: RegExp): ToomicsBase {
        this.customChapterUrlPattern = customChapterUrlPattern;
        return this;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        for (const language of this.languages) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, this.mangaPath.replace('{language}', language), queryMangas, MangaInfoExtractor);
            mangalist.push(...mangas);
        }
        return mangalist.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const decode = (e: string) => GetUTF8FromBytes(GetBytesFromBase64(e));

        const chaptersNodes = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), queryChapters);
        const mangaTitle = this.languages.length > 1 ? manga.Title.replace(/\[.*\]$/, '').trim() : manga.Title;
        return chaptersNodes.map(anchor => {

            const title = [
                anchor.querySelector(queryChapterNum)?.textContent,
                anchor.querySelector(queryChapterTitle)?.textContent
            ].joinTitleSegments();

            //First try to build matching url from dataset element if they exists
            const lang = ExtractLanguageFromPathName(manga.Identifier);
            let id = lang ? `/${lang}` : '';

            if (anchor.dataset?.e && anchor.dataset?.c && anchor.dataset?.v) {
                id += `/webtoon/detail/code/${decode(anchor.dataset.c)}/ep/${decode(anchor.dataset.v)}/toon/${decode(anchor.dataset.e)}`;
            }
            else {
                //look for url pattern in "onclick"
                const action = anchor.getAttribute('onclick');
                const regexp = this.customChapterUrlPattern ? this.customChapterUrlPattern : new RegExp(`(/${lang})?/webtoon/detail/code/\\d+/ep/\\d+/toon/\\d+`);
                id = action?.match(regexp)?.at(0);
            }
            return new Chapter(this, manga, new URL(id ? id : anchor.pathname, this.URI).pathname, title.replace(mangaTitle, '').trim());
        }).reverse();
    }

    public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, queryPages, PageExtractor);
        return pages.filter(page => [/warning(-\d+)?-dark\.png$/].none(pattern => pattern.test(page.Link.pathname)));
    }
}
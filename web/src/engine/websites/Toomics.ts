import { Tags } from '../Tags';
import icon from './Toomics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

function MangaExtractor(element: HTMLAnchorElement) {
    const language = element.pathname.match(/([a-z]+)\/webtoon/)[1];
    return {
        id: element.pathname,
        title: [element.querySelector('h4.title').textContent.trim(), `[${language}]`].join(' ').trim()
    };
}

function ChapterExtractor(element: HTMLAnchorElement) {
    const action = element.getAttribute('onclick');
    if (action) {
        if (action.includes('location.href=')) {
            element.href = action.match(/href='([^']+)'/)[1];
        } else {
            element.href = action.match(/popup\s*\(\s*'[^']+'\s*,\s*'[^']*'\s*,\s*'([^']+)'/)[1];
        }
    }
    const chapterNumber = element.querySelector('div.cell-num').textContent.trim();
    const subtitle = element.querySelector('div.cell-title').textContent;
    return {
        id: element.pathname,
        title: [chapterNumber, subtitle].join(' ').trim()
    };
}

const languagesURLPaths = ['en', 'es', 'de', 'fr', 'it', 'jp', 'mx', 'por', 'sc', 'tc']; //ie 'https://global.toomics.com/en'

@Common.PagesSinglePageCSS('#viewer-img img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics', `Toomics (Global)`, 'https://global.toomics.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[a-z]+/webtoon/episode/toon/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const lang = url.match(/([a-z]+)\/webtoon/)[1];
        const [mangatitle] = await FetchCSS(new Request(url), 'section.ep-header_ch div.title_content h1');
        return new Manga(this, provider, new URL(url).pathname, [mangatitle.textContent.trim(), `[${lang}]`].join(' ').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        for (const language of languagesURLPaths) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, `/${language}/webtoon/ranking`, 'div.section_ongoing div.list_wrap ul li > div.visual > a', MangaExtractor);
            mangalist.push(...mangas);
        }
        return mangalist.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'ol.list-ep li a', ChapterExtractor);
        const mangatitle = manga.Title.replace(/\[.+\]$/, '').trim();
        return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replace(mangatitle, '').trim()));
    }

}
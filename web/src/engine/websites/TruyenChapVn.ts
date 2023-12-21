import { Tags } from '../Tags';
import icon from './TruyenChapVn.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.text.replace(/\(chap.vn\)/i, '').trim()
    };
}

function MangaLabelExtractor(element: HTMLElement) {
    return element.textContent.replace(/\(chap.vn\)/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/truyen\/[^/]+\/$/, 'div.page-header h1#tables', MangaLabelExtractor)
@Common.MangasSinglePageCSS(FlatManga.pathSinglePageManga, FlatManga.queryMangas, MangaExtractor)
@Common.PagesSinglePageCSS('img.chapter-img')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyenchapvn', `TruyenChapVn`, 'https://truyen.chap.vn', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FlatManga.FetchChaptersSinglePageCSS.call(this, manga);
        return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replace(/\(chap.vn\)/i, '').trim()));
    }
}
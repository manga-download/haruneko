import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { queryMangas, CleanTitle, ClipBoardExtractor, queryMangaTitle } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/manga\d+\/[^/]+\.html$/, queryMangaTitle, ClipBoardExtractor)
@Common.MangasMultiPageCSS<HTMLAnchorElement>(queryMangas, Common.PatternLinkGenerator('/manga-list.html?p={page}'), 0, anchor => ({ id: anchor.pathname, title: CleanTitle(anchor.text) }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.chapter-grid-item', undefined, anchor => ({
    id: anchor.pathname,
    title: CleanTitle(anchor.querySelector('div.chapter-name-grid').textContent.trim())
}))
@Common.PagesSinglePageJS(`PageReader.getImages();`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('unlock_chapter_guest', '1')`);
    }
}
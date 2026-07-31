import { Tags } from '../Tags';
import icon from './NihonKuni.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { AnchorExtractor, CleanTitle, ClipBoardExtractor, MangasLinkGenerator, queryPages } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html$/, 'h1.manga-main-title', ClipBoardExtractor)
@Common.MangasMultiPageCSS('a.manga-title', MangasLinkGenerator, 0, AnchorExtractor)
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapters_raw_data a', undefined, anchor => ({
    id: anchor.pathname,
    title: CleanTitle(anchor.querySelector('span.chapter-name').textContent.trim())
}))
@Common.PagesSinglePageCSS(queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagun', 'NihonKuni', 'https://nihonkuni.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            window.cookieStore.set('smartlink_shown_guest', '1');
            window.cookieStore.set('smartlink_shown', '1');
        `);
    }
}
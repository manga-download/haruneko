import { Tags } from '../Tags';
import icon from './WeLoMa.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { AnchorExtractor, queryMangaTitle, ClipBoardExtractor, queryMangas, MangasLinkGenerator, queryChapters, queryPages } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/m\/[^/]+$/, queryMangaTitle, ClipBoardExtractor)
@Common.MangasMultiPageCSS(queryMangas, MangasLinkGenerator, 0, AnchorExtractor)
@Common.ChaptersSinglePageCSS(queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS<HTMLImageElement>(queryPages, img => window.atob(img.dataset.img))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('weloma', 'WeLoMa', 'https://weloma.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            window.cookieStore.set('smartlink_shown_guest', '1');
            window.cookieStore.set('smartlink_shown', '1');
        `);
    }

    public override get Icon() {
        return icon;
    }
}
import { Tags } from '../Tags';
import icon from './WeLoMa.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetUTF8FromBytes } from '../BufferEncoder';

@Common.MangaCSS(/^{origin}\/m\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS(FlatManga.queryMangas, FlatManga.MangasLinkGenerator)
@Common.ChaptersSinglePageCSS(FlatManga.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS(FlatManga.queryPages, (img: HTMLImageElement) => GetUTF8FromBytes(GetBytesFromBase64(img.dataset.img)))
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
import { Tags } from '../Tags';
import icon from './MangaFox.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as DM5 from './decorators/DM5';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.detail-info span.detail-info-right-title-font')
@Common.MangasMultiPageCSS('div.manga-list-1 ul li p.manga-list-1-item-title a', Common.PatternLinkGenerator('/directory/{page}.html?az'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapterlist ul li a', undefined, Common.AnchorInfoExtractor(true))
@DM5.PagesSinglePageScript()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangafox', 'MangaFox', 'https://fanfox.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookie.set('isAdult', '1')`);
    }

    public override get Icon() {
        return icon;
    }
}

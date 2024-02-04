import { Tags } from '../Tags';
import icon from './DianxiaTrads.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Dianxia Traduções"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break noscript img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dianxiatrads', 'Dianxia Traduções', 'https://dianxiatrads.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
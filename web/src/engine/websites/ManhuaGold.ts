import { Tags } from '../Tags';
import icon from './ManhuaGold.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="comickiba"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break img, li.blocks-gallery-item img')
@Common.ImageAjax()

// TODO Website is similar to MangareaderTO, and Mangasect. Make a template for MangareaderTO websites
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuagold', 'Manhua Gold', 'https://manhuagold.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
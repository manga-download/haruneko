import { Tags } from '../Tags';
import icon from './LumosKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Lumos"]')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2('div.chapter-link > a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lumoskomik', 'LumosKomik', 'https://lumos01.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
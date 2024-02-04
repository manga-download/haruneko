import { Tags } from '../Tags';
import icon from './WorldManhwas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="WorldManhwas"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('worldmanhwas', 'WorldManhwas', 'https://worldmanhwas.zone', Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
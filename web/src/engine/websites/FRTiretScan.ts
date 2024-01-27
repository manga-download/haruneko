import { Tags } from '../Tags';
import icon from './FRTiretScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Fr-Scan"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break noscript img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('frtiretscan', `FR-Scan`, 'https://fr-scan.com', Tags.Language.French, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
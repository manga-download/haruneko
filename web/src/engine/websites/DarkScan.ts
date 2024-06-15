import { Tags } from '../Tags';
import icon from './DarkScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Dark scan"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@MangaStream.PagesSinglePageCSS([/\/zzzz\.jpg$/, /\/0\.\d+\.jpg/, /(discord|promocion|reclutamiento)\.jpg/], 'div.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkscan', 'Dark Scan', 'https://dark-scan.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
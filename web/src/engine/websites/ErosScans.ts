import { Tags } from '../Tags';
import icon from './ErosScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li div.chbox:not(:has(.dt)) div.eph-num a') //Exclude chapters on TecnoScans
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('erosscans', 'Eros Scans', 'https://tercoscans.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
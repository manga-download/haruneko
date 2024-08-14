import { Tags } from '../Tags';
import icon from './LuminousScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/{origin}\/series\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS([/\/NovelBanner[^.]+\.(png|jpeg|jpg|gif)$/i])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('luminousscans', 'Luminous Scans', 'https://luminous-scans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
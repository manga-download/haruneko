import { Tags } from '../Tags';
import icon from './LynxScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@MangaStream.MangaCSS(/^https?:\/\/lynxscans\.com\/comics\/\S+$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/comics/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('lynxscans', `Lynx Scans`, 'https://lynxscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }
}
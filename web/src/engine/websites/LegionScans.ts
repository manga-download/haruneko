import { Tags } from '../Tags';
import icon from './LegionScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/wp\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/wp/manga/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax(undefined, true)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('legionscans', 'Legion Scans', 'https://legionscans.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}

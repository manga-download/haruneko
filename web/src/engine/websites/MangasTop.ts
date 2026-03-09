import { Tags } from '../Tags';
import icon from './MangasTop.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastop', 'Mangas Top', 'https://mangastop.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}
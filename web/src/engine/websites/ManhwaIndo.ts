import { Tags } from '../Tags';
import icon from './ManhwaIndo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/series\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaindo', 'ManhwaIndo', 'https://manhwaindo.one', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}
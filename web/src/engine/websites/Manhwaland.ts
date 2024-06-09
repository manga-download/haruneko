import { Tags } from '../Tags';
import icon from './Manhwaland.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaland', 'Manhwaland', 'https://www.manhwaland.to', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
import { Tags } from '../Tags';
import icon from './TresDaos.webp';
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
        super('tresdaos', 'Tres Daos', 'https://tresdaos.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}

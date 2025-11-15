import { Tags } from '../Tags';
import icon from './Kanzenin.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS('ts_reader.params.sources.shift().images;', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kanzenin', 'Kanzenin', 'https://kanzenin.info', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Indonesian, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
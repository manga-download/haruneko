import { Tags } from '../Tags';
import icon from './NgomikID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([/\/999\.(jpg|png)$/])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ngomikid', 'Ngomik ID', 'https://ngomik.id', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
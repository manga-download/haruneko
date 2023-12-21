import { Tags } from '../Tags';
import icon from './ToomTam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Common.MangasMultiPageCSS('/manga/?page={page}', 'div.bs div.bsx a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomtam', 'ToomTam', 'https://toomtam-manga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
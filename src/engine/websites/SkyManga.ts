import { Tags } from '../Tags';
import icon from './SkyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+$/)
@Common.MangasMultiPageCSS('div.bs div.bsx > a', Common.PatternLinkGenerator('/manga-list?page={page}'), 0, Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skymanga', 'Sky Manga', 'https://skymanga.work', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
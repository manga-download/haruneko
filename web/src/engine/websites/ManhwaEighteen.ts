import { Tags } from '../Tags';
import icon from './ManhwaEighteen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('/manga-list?page={page}', FlatManga.queryMangas)
@Common.ChaptersSinglePageCSS(FlatManga.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#chapter-content img.lazy')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa18-int', 'Manhwa 18 (.net)', 'https://manhwa18.net', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
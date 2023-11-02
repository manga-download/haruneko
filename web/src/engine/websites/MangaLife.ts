import { Tags } from '../Tags';
import icon from './MangaLife.webp';
import { DecoratableMangaScraper} from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaLife from './decorators/MangaLife';

@MangaLife.Initialize()
@Common.MangaCSS(/^https?:\/\/manga4life\.com\/manga\/[^/]+$/, MangaLife.queryMangaTitle, MangaLife.ElementLabelExtractor)
@MangaLife.MangasSinglePageCSS()
@Common.ChaptersSinglePageJS(MangaLife.chapterScript, 1500)
@Common.PagesSinglePageJS(MangaLife.pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangalife', `MangaLife`, 'https://manga4life.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}
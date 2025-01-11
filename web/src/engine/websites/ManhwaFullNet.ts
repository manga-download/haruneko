import { Tags } from '../Tags';
import icon from './HolyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ChaptersSinglePageCSS(FlatManga.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS(FlatManga.queryPages, FlatManga.PageLinkExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwafullnet', 'ManhwaFull(.net)', 'https://manhwafull.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
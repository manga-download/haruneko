import { Tags } from '../Tags';
import icon from './MagusManga.webp';
import { VTheme } from './templates/VTheme';

/*
@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, KeyoApp.queryMangaTitle)
@Common.MangasSinglePagesCSS([ KeyoApp.queryMangaPath ], KeyoApp.queryManga, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(KeyoApp.pagesScript, 500)
@Common.ImageAjax(true)*/
export default class extends VTheme {

    public constructor() {
        super('magusmanga', 'MagusManga', 'https://magustoon.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
        this.apiUrl = new URL('https://api.magustoon.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}
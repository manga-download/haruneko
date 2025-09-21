import { Tags } from '../Tags';
import icon from './NihonKuni.webp';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.pathMangasMultiPage, FlatManga.queryMangas)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('${FlatManga.queryPages}')].map(image=>image.dataset.srcset);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagun', 'NihonKuni', 'https://nihonkuni.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?slug={manga}', FlatManga.queryChapters);
    }
}
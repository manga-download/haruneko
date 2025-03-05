import { Tags } from '../Tags';
import icon from './MangaGun.webp';
import { DecoratableMangaScraper, type Manga, type Chapter, type Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(FlatManga.pathManga, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.pathMangasMultiPage, FlatManga.queryMangas)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagun', 'MangaGun', 'https://mangagun.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?slug={manga}', FlatManga.queryChapters);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return FlatManga.FetchPagesAJAX.call(
            this,
            chapter,
            /load_image\s*\(\s*(\d+)\s*,\s*'imgsChapter'\s*\)/g,
            '/app/manga/controllers/cont.Showimage.php?cid={chapter}',
            FlatManga.queryPages,
            img => img.dataset.srcset);
    }
}
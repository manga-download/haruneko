import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { DecoratableMangaScraper, type Manga, type Chapter, type Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.queryMangas, FlatManga.MangasLinkGenerator)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://love4u.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?mid={manga}', FlatManga.queryChapters, (manga: Manga) => manga.Identifier.match(/\d+/).at(0));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return FlatManga.FetchPagesAJAX.call(
            this,
            chapter,
            /load_image\s*\(\s*(\d+)\s*,\s*'list-imga'\s*\)/g,
            '/app/manga/controllers/cont.listImg.php?cid={chapter}',
            FlatManga.queryPages,
            img => img.dataset.srcset);
    }
}
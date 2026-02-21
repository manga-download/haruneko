import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.queryMangas, FlatManga.MangasLinkGenerator)
@Common.PagesSinglePageCSS(FlatManga.queryPages, (img: HTMLImageElement) => atob(img.dataset.img))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://love4u.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), () => {
            window.cookieStore.set('smartlink_shown_guest', '1');
            window.cookieStore.set('smartlink_shown', '1');
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?mid={manga}', FlatManga.queryChapters, (manga: Manga) => manga.Identifier.match(/\d+/).at(0));
    }
}
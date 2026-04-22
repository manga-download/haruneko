import { Tags } from '../Tags';
import icon from './NihonKuni.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, 'h1.manga-main-title')
@Common.MangasMultiPageCSS('a.manga-title', FlatManga.MangasLinkGenerator)
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagun', 'NihonKuni', 'https://nihonkuni.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
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
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?slug={manga}', FlatManga.queryChapters);
    }
}
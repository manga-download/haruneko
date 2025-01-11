import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/(mgraw-)?\d+\/$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageJS(`'/app/manga/controllers/cont.Listchapter.php?mid=' + mIds`)
@FlatManga.PagesSinglePageAJAX('/app/manga/controllers/cont.listImg.php?cid=', 'img.chapter-img:not([alt*="nicoscan"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://welovemanga.one', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 15000);//trigger antiDDOSS
    }
}
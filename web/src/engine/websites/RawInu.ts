import { Tags } from '../Tags';
import icon from './RawInu.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { queryMangaTitle, ClipBoardExtractor, FlatManga } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, queryMangaTitle, ClipBoardExtractor)
export default class extends FlatManga {

    public constructor() {
        super('rawinu', 'RawInu', 'https://rawinu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
        this.WithChapterAjaxEndpoint('/app/manga/controllers/cont.Listchapter.php?slug={manga}');
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('unlock_chapter_guest', '1')`);
    }
}
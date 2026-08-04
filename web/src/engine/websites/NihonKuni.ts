import { Tags } from '../Tags';
import icon from './NihonKuni.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { queryMangaTitle, CleanTitle, ClipBoardExtractor, FlatManga } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html$/, queryMangaTitle, ClipBoardExtractor)
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapters_raw_data a', undefined, anchor => ({
    id: anchor.pathname,
    title: CleanTitle(anchor.querySelector('span.chapter-name').textContent.trim())
}))
export default class extends FlatManga {

    public constructor() {
        super('mangagun', 'NihonKuni', 'https://nihonkuni.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('unlock_chapter_guest', '1')`);
    }
}
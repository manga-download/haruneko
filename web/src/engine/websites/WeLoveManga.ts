import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { queryMangaTitle, ClipBoardExtractor, queryMangas, MangasLinkGenerator, CleanTitle, FlatManga } from './templates/FlatManga';

function MangaExtractor(element: HTMLElement, uri: URL) {
    const { id, title } = ClipBoardExtractor(element, uri); //extract pathname and clean title
    return {
        id: CleanPathname(id), //remove manga- from pathname
        title
    };
}

function CleanPathname(path: string): string {
    return path.replace(/^\/manga-/, '/');
}

@Common.MangaCSS(/^{origin}\/(manga-)?\d+\/$/, queryMangaTitle, MangaExtractor)
@Common.MangasMultiPageCSS<HTMLAnchorElement>(queryMangas, MangasLinkGenerator, 0, anchor => ({
    id: CleanPathname(anchor.pathname),
    title: CleanTitle(anchor.title)
}))
export default class extends FlatManga {

    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://love4u.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
        this.WithChapterAjaxEndpoint('/app/manga/controllers/cont.Listchapter.php?mid={manga}')
            .WithMangaSlugExtractor(mangaId => mangaId.match(/\d+/).at(0));
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('unlock_chapter_guest', '1')`);
    }
}
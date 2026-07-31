import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { queryMangaTitle, ClipBoardExtractor, queryMangas, MangasLinkGenerator, queryPages, queryChapters, FetchChaptersAJAX, CleanTitle } from './templates/FlatManga';

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
@Common.PagesSinglePageCSS(queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://love4u.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            window.cookieStore.set('smartlink_shown_guest', '1');
            window.cookieStore.set('smartlink_shown', '1');
        `);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FetchChaptersAJAX.call(this, manga, '/app/manga/controllers/cont.Listchapter.php?mid={manga}', queryChapters, (manga: Manga) => manga.Identifier.match(/\d+/).at(0));
    }
}
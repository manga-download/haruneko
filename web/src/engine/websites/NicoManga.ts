import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, type Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

type APIManga = {
    name: string,
    slug: string,
    url: string,
}

type APIMangas = {
    data: APIManga[]
}

type APIChapter = {
    chapter: string,
    name: string,
}

type APIChapters = APIChapter[];

@Common.MangaCSS<HTMLSpanElement>(FlatManga.pathManga, 'nav ul > span', (head, uri) => ({ id: uri.pathname, title: head.innerText.replace(/\(MANGA\)$/i, '').trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly pathChapters = '/app/manga/controllers/cont.Listchapter.php?slug={manga}';

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('smartlink_shown_guest', '1')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL('/app/manga/controllers/cont.allmanga.php', this.URI)));
        return data.map(manga => new Manga(this, provider, `/${manga.slug}.html`, manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier.replace('.html', '').replace('/manga-', '').replace('/', '');
        const uri = new URL(this.pathChapters.replace('{manga}', slug), this.URI);
        const chapters = await FetchJSON<APIChapters>(new Request(uri));
        return chapters.map(chapter => new Chapter(this, manga, `/read-${slug}-chapter-${chapter.chapter}.html`, chapter.name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return FlatManga.FetchPagesAJAX.call(
            this,
            chapter,
            /loadImagesChapter\s*\((\d+)\s*/g,
            `app/manga/controllers/cont.imgsList.php?cid={chapter}`,
            FlatManga.queryPages,
            img => img.dataset.srcset.trim());
    }
}

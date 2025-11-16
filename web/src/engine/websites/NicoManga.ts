import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

type ApiManga = {
    name: string,
    slug: string,
    url: string,
}

type APIMangas = {
    data: ApiManga[]
}

type APIChapter = {
    chapter: string,
    name: string,
}

type APIChapters = APIChapter[];

@Common.MangaCSS<HTMLHeadingElement>(FlatManga.pathManga, FlatManga.queryMangaTitle, (head, uri) => ({ id: uri.pathname, title: head.innerText.replace(/\(MANGA\)$/i, '').trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly pathChapters = '/app/manga/controllers/cont.Listchapter.php?slug={manga}';

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL("/app/manga/controllers/cont.allmanga.php", this.URI)));
        return data.map(manga => new Manga(this, provider, `/${manga.slug}.html`, manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier.replace(".html", "").replace("/", "");
        const uri = new URL(this.pathChapters.replace('{manga}', slug), this.URI);
        const chapters = await FetchJSON<APIChapters>(new Request(uri));
        return chapters.map(chapter => new Chapter(this, manga, `/read-${slug}-chapter-${chapter.chapter}.html`, chapter.name));
    }

    public async ExtractImages(chapter: Chapter): Promise<HTMLImageElement[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const html_cid = await FetchCSS<HTMLInputElement>(new Request(uri, {headers: {"Cookie": "smartlink_shown_guest=1"}}), "input#chapter");
        const cid = html_cid[0].getAttribute("value");
        return await FetchCSS<HTMLImageElement>(new Request(new URL(`/app/manga/controllers/cont.imgsList.php?cid=${cid}`, this.URI)), "img.chapter-img");
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await this.ExtractImages(chapter);
        return images.map(img => new Page(this, chapter, new URL(img.getAttribute("data-srcset"))));
    }
}

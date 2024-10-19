import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    posts: APIManga[]
}

type APISingleManga = {
    post: APIManga
}

type APIManga = {
    id: number,
    slug: string,
    postTitle: string,
    chapters?: APIChapter[]
}

type APIChapter = {
    id: number,
    slug: string,
    number: number,
    title: string
}

type MangaID = {
    id: string,
    slug: string,
}

const pageScript = `[...document.querySelectorAll('section img[loading]')].map(image => new URL(image.getAttribute('src'), window.location.origin).href);`;

@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = new URL('/api/', this.URI);

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaSlug = url.split('/').pop();
        const { post: { id, slug, postTitle } } = await FetchJSON<APISingleManga>(new Request(new URL(`post?postSlug=${mangaSlug}`, this.apiUrl)));
        return new Manga(this, provider, JSON.stringify({ slug, id: id.toString() }), postTitle);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { posts } = await FetchJSON<APIMangas>(new Request(new URL(`query?page=${page}&perPage=200`, this.apiUrl)));
        return posts.map(item => new Manga(this, provider, JSON.stringify({ slug: item.slug, id: item.id.toString() }), item.postTitle));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id, slug } = JSON.parse(manga.Identifier) as MangaID;
        const { post: { chapters } } = await FetchJSON<APISingleManga>(new Request(new URL(`chapters?postId=${id}&skip=0&take=9999`, this.apiUrl)));
        return chapters ? chapters.map(chapter => {
            const title = chapter.title ? `${chapter.number} : ${chapter.title}` : chapter.number.toString();
            return new Chapter(this, manga, `/series/${slug}/${chapter.slug}`, title);
        }) : [];
    }
}

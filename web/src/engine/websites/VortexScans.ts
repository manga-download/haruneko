import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangas = {
    posts: APIManga[]
}

type APIChapters = {
    post: APIManga
}

type APIManga = {
    id: number,
    slug: string,
    postTitle: string,
    chapters: APIChapter[]
}

type APIChapter = {
    id: number,
    slug: string,
    number: number,
    title: string
}

type MangaID = {
    id: number,
    slug: string,
    title?: string
}

type APIPages = {
    chapter: {
        images: {
            url: string
        }[]
    }
}

const mangaIdScript = `
    new Promise((resolve, reject) => {
       const myregexp = /"postId"\\s*:\\s*(\\d+)/i;
        __next_f.forEach(element => {
            const el = element[1];
            if (el) {
                if((myregexp.test(el)))  {
                   const id = parseInt(el.match(myregexp)[1]);
                   const title = document.querySelector('meta[property="og:title"]').content.trim();
                   const slug = window.location.pathname.split('/').pop();
                   resolve({id: id, title: title, slug: slug});
                }
            }
        });
        reject();
    });

`;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = new URL('/api/', this.URI);

    public constructor() {
        super('vortexscans', `Vortex Scans`, 'https://vortexscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await FetchWindowScript<MangaID>(new Request(url), mangaIdScript, 500);
        return new Manga(this, provider, JSON.stringify({ id: data.id, slug: data.slug }), data.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const endpoint = new URL('query?perPage=9999', this.apiURL);
        const { posts } = await FetchJSON<APIMangas>(new Request(endpoint));
        return posts.map(manga => new Manga(this, provider, JSON.stringify({
            id: manga.id.toString(),
            slug: manga.slug
        }), manga.postTitle.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid: MangaID = JSON.parse(manga.Identifier);
        const endpoint = new URL(`chapters/?postId=${mangaid.id}&skip=0&take=99999&order=asc`, this.apiURL);
        const { post } = await FetchJSON<APIChapters>(new Request(endpoint));
        return post.chapters.map(chapter => new Chapter(this, manga, chapter.slug, [chapter.number.toString(), chapter.title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaid: MangaID = JSON.parse(chapter.Parent.Identifier);
        const endpoint = new URL(`chapter/${mangaid.slug}/${chapter.Identifier}`, this.apiURL);
        const data = await FetchJSON<APIPages>(new Request(endpoint));
        return data.chapter.images.map(page => new Page(this, chapter, new URL(page.url, this.URI)));
    }
}

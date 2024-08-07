import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
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
    id: string,
    slug: string,
    title?: string
}

const mangaIdScript = `
    new Promise(resolve => {
       const myregexp = /"postId"\\s*:\\s*(\\d+)/i;
       const element = __next_f.find(el => el[1] && el[1].match(myregexp));
       const id = element[1].match(myregexp)[1];
       const title = document.querySelector('meta[property="og:title"]').content.trim();
       const slug = window.location.pathname.split('/').pop();
       resolve({id: id, title: title, slug: slug});
    });

`;

const pageScript = `
    new Promise( resolve =>  resolve([...document.querySelectorAll('section img[loading]')].map(img => img.src)) );
`;

@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = new URL('/api/', this.URI);

    public constructor() {
        super('vortexscans', `Vortex Scans`, 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await FetchWindowScript<MangaID>(new Request(url), mangaIdScript, 4000);
        return new Manga(this, provider, JSON.stringify({ id: data.id.toString(), slug: data.slug }), data.title);
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
        return post.chapters.map(chapter => new Chapter(this, manga, `/series/${mangaid.slug}/${chapter.slug}`, [chapter.number.toString(), chapter.title].join(' ').trim()));
    }
}

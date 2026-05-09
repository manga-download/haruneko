import { Tags } from '../Tags';
import icon from './NexusScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    slug: string;
    tipo: string;
    titulo: string;
};

type APIMangaDetails = {
    serie: APIManga;
    capitulos: APIChapter[];
};

type APIChapter = {
    numero: number;
    slug: string;
};

type APIPages = {
    data: {
        paginas: {
            url: string;
        }[];
    }
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.nexusscanlation.com/api/v1/';
    private readonly CDN = 'https://cdn.nexusscanlation.com';

    public constructor() {
        super('nexusscans', 'Nexus Scans', 'https://nexusscanlation.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('nexus-age-filter', 'all')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { serie: { slug, titulo } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, titulo);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./catalog?page=${page}&limit=50`, this.apiUrl)));
                const mangas = data
                    .filter(({ tipo }) => tipo != 'novel')
                    .map(({ slug, titulo }) => new Manga(this, provider, slug, titulo));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${manga.Identifier}`, this.apiUrl)));
        return capitulos.map(({ slug, numero }) => new Chapter(this, manga, slug, `${numero}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { paginas } } = await FetchJSON<APIPages>(new Request(new URL(`./series/${chapter.Parent.Identifier}/capitulos/${chapter.Identifier}`, this.apiUrl)));
        return paginas.map(({ url }) => {
            const uri = new URL(url);
            return new Page(this, chapter, uri.hostname.endsWith('r2.cloudflarestorage.com') ? new URL(uri.pathname, this.CDN) : uri);
        });
    }
}
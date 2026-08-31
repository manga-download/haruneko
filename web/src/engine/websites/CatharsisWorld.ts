import { DecryptXOR } from '../Crypto';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import type { Priority } from '../taskpool/DeferredTask';
import icon from './CatharsisWorld.webp';
import * as Common from './decorators/Common';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    id: number;
    nombre: string;
    capitulos: APIChapter[];
};

type APIChapter = {
    id: number;
    titulo: string;
    paginas: string[] | {
        url?: string;
    }[];
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.catharsisfood.com/';

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://newcatharsis.dig-it.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, nombre } = await this.FetchAPI<APIManga>(`./mangas/${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id}`, nombre);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIMangas>(`./mangas?limit=500&page=${page}`);
                const mangas = data.map(({ id, nombre }) => new Manga(this, provider, `${id}`, nombre));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await this.FetchAPI<APIManga>(`./mangas/${manga.Identifier}`);
        return capitulos.map(({ id, titulo }) => new Chapter(this, manga, `${id}`, titulo));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { paginas } = await this.FetchAPI<APIChapter>(`./mangas/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        return paginas.map(page => {
            const pageUrl: string = (typeof page === 'string' ? page : page.url).replace(/^\//, '');
            return new Page(this, chapter, new URL(`https://api.catharsisfood.com/mangas/pages/${pageUrl ?? '/imgs/1 (1).png'}`));
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        return Common.GetTypedData(DecryptXOR(new Uint8Array(await blob.arrayBuffer()), new Uint8Array([0x43])).buffer);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'System': 'catharsis',
                'X-Fk-Sistema': '3'
            }
        }));
    }
}
import { Tags } from '../Tags';
import icon from './ImperioDaBritannia.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';
import { GetBytesFromHex, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

type APIManga = {
    obra: {
        slug: string;
        nome: string;
    };
};

type APIMangas = {
    obras: APIManga['obra'][];
};

type APIChapters = {
    obra: {
        capitulos: {
            id: number;
            nome: string;
            numero: string;
            obra_id: number;
        }[];
    };
};

type APIPages = {
    capitulo: {
        paginas: APIPage[]
    }
};

type APIPage = {
    cdn_id?: string;
    url?: string;
    numero: number;
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.imperiodabritannia.net/api/';
    private readonly cdnURL = 'https://cdn.imperiodabritannia.net/';

    public constructor() {
        super('imperiodabritania', 'Imperio Da Britannia', 'https://imperiodabritannia.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/?/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaID = new URL(url).pathname.split('/').at(2);
        const { obra: { slug, nome } } = await this.FetchAPI<APIManga>(`./obras/by-slug/${mangaID}`);
        return new Manga(this, provider, slug, nome);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { obras } = await this.FetchAPI<APIMangas>(`./obras?limite=200&pagina=${page}`);
                const mangas = obras.map(({ slug, nome }) => new Manga(this, provider, slug, nome));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { obra: { capitulos } } = await this.FetchAPI<APIChapters>(`./obras/by-slug/${manga.Identifier}/`);
        return capitulos.reverse().map(({ nome, numero, obra_id: mangaId }) => new Chapter(this, manga, `${mangaId}/${parseInt(numero, 10)}`, nome || `Capítulo ${numero}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [mangaId, chapterNumber] = chapter.Identifier.split('/');
        const { capitulo: { paginas } } = await this.FetchAPI<APIPages>(`./obras/${mangaId}/capitulos/${chapterNumber}`);
        return paginas.map(page => new Page(this, chapter, new URL(this.CookPictureUrl(page, mangaId, chapterNumber))));
    }

    private CookPictureUrl(page: APIPage, mangaId: string, chapterNumber: string): string {
        const { url, cdn_id, numero } = page;
        if (url?.startsWith('http') || cdn_id?.startsWith('http')) {
            return url || cdn_id;
        }
        if (cdn_id) {
            const base = cdn_id.startsWith('obras/') || cdn_id.startsWith('usuarios/') ? cdn_id : `proxy/${cdn_id}`;
            return `${this.cdnURL}${base}`;
        }
        return `${this.cdnURL}obras/${mangaId}/capitulo-${chapterNumber}/pagina_${String(numero).padStart(3, '0')}.webp`;
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const response = await Fetch(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Token': 'bunker_api_token_secreto_2025',
            }
        }));
        return response.headers.get('x-encrypted') === 'true' ? this.Decrypt<T>(await response.text()) : await response.json() as T;
    }

    private async Decrypt<T extends JSONElement>(text: string): Promise<T> {
        const [iv, encrypted] = text.split(':');
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const key = await crypto.subtle.importKey('raw',
            await crypto.subtle.digest('SHA-256', GetBytesFromUTF8('mangotoons_encryption_key_2025' + 'salt')),
            algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, GetBytesFromHex(encrypted));
        return JSON.parse(GetUTF8FromBytes(decrypted)) as T;
    }

}
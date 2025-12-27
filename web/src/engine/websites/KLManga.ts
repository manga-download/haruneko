import { Tags } from '../Tags';
import icon from './KLManga.webp';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { GetHexFromBytes } from '../BufferEncoder';

type APIManga = {
    name: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    chapter: number;
};

function CleanMangaTitle(title: string): string {
    return title.replace(/\(Manga\)/i, '').replace(/- RAW/i, '').trim();
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://klz9.com/api/';

    public constructor() {
        super('klmanga', 'KLManga', 'https://klz9.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('manga_18_verified_v2', 'true')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/.]+\.html$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { name, slug } = await this.FetchAPI<APIManga>(`./manga/slug/${url.split('/').at(-1).replace('.html', '')}`);
        return new Manga(this, provider, slug, CleanMangaTitle(name));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await this.FetchAPI<APIManga[]>('./manga/all');
        return mangas.map(({ slug, name }) => new Manga(this, provider, slug, CleanMangaTitle(name)));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/slug/${manga.Identifier}`);
        return chapters.map(({ id, chapter }) => new Chapter(this, manga, `${id}`, `Chapter ${chapter}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const serverReplacement = {
            'https://imfaclub.com': 'https://h1.klimv1.xyz',
            'https://s2.imfaclub.com': 'https://h2.klimv1.xyz',
            'https://s4.imfaclub.com': 'https://h4.klimv1.xyz',
            'https://ihlv1.xyz': 'https://h1.klimv1.xyz',
            'https://s2.ihlv1.xyz': 'https://h2.klimv1.xyz',
            'https://s4.ihlv1.xyz': 'https://h4.klimv1.xyz',
            'https://h1.klimv1.xyz': 'https://j1.jfimv2.xyz',
            'https://h2.klimv1.xyz': 'https://j2.jfimv2.xyz',
            'https://h4.klimv1.xyz': 'https://j4.jfimv2.xyz',
        };

        const { content } = await this.FetchAPI<{ content: string }>(`./chapter/${chapter.Identifier}`);
        return content.split('\n').map(page => new Page(this, chapter,
            new URL(Object.entries(serverReplacement).reduce((currentString, [originalUrl, newUrl]) => currentString.replace(originalUrl, newUrl), page.trim()))));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const key = 'KL9K40zaSyC9K40vOMLLbEcepIFBhUKXwELqxlwTEF';
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = GetHexFromBytes(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${timestamp}.${key}`))));
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                'x-client-ts': timestamp,
                'x-client-sig': signature
            }
        }));
    }
}
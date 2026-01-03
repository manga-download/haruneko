import { Tags } from '../Tags';
import icon from './KLManga.webp';
import { GetHexFromBytes } from '../BufferEncoder';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

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
        return new RegExpSafe(`^${this.URI.origin}/[^/]+.html$`).test(url);
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
        const hosts = new Map<string, string>([
            ['imfaclub.com', 'j1.jfimv2.xyz'],
            ['s2.imfaclub.com', 'j2.jfimv2.xyz'],
            ['s4.imfaclub.com', 'j4.jfimv2.xyz'],
            ['ihlv1.xyz', 'j1.jfimv2.xyz'],
            ['s2.ihlv1.xyz', 'j2.jfimv2.xyz'],
            ['s4.ihlv1.xyz', 'j4.jfimv2.xyz'],
        ]);

        const excluded = [
            'LHScan.png',
            'Credit_LHScan_5d52edc2409e7.jpg',
            '5e1ad960d67b2_5e1ad962338c7.jpg',
        ]

        const { content } = await this.FetchAPI<{ content: string }>(`./chapter/${chapter.Identifier}`);
        return content
            .split('\n')
            .filter(link => !excluded.some(file => link.endsWith(file)))
            .map(link => {
                const uri = new URL(link);
                uri.hostname = hosts.get(uri.hostname) ?? uri.hostname;
                return new Page(this, chapter, uri);
            });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const timestamp = `${Date.now() / 1000 | 0}`;
        const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${timestamp}.KL9K40zaSyC9K40vOMLLbEcepIFBhUKXwELqxlwTEF`));
        return FetchJSON<T>(new Request(new URL(endpoint, 'https://klz9.com/api/'), {
            headers: {
                'X-Client-Ts': timestamp,
                'X-Client-Sig': GetHexFromBytes(new Uint8Array(signature)),
            }
        }));
    }
}
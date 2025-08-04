import { Tags } from '../Tags';
import icon from './SetsuScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    title: string,
    slug: string,
    chapters: APIChapter[]
}

type APIChapter = {
    title: string,
    chapter_number: string,
    slug: string,
    full_image_paths: string[]
}

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.saytsu.com/';

    public constructor() {
        super('setsuscans', 'SetsuScans', 'https://manga.saytsu.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('isHuman', JSON.stringify({ valid: true, expiresAt : Date.now() + 7*24*60*60*1000 }));`, 1500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const manga = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, manga.slug, manga.title);
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
        const mangas = await this.FetchAPI<APIManga[]>(`./mangaloaded?page=${page}&page_size=100`);
        return mangas.map(manga => new Manga(this, provider, manga.slug, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/${manga.Identifier}`);
        return chapters.map(chapter => new Chapter(this, manga, chapter.slug, ['Chapter', chapter.chapter_number, chapter.title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { full_image_paths } = await this.FetchAPI<APIChapter>(`./manga/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        return full_image_paths.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link, {
                signal: signal,
                headers: {
                    Accept: 'image/webp, human/ok',
                    Referer: new URL(`./manga/${page.Parent.Parent.Identifier}/${page.Parent.Identifier}`, this.URI).href
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl)));
    }
}
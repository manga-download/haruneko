import { Tags } from '../Tags';
import icon from './SetsuScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    title: string;
    slug: string;
};

type APIChapters = {
    chapters: {
        slug: string;
        chapter_number: string;
    }[];
};

type APIPages = {
    full_image_paths: string[];
};

export default class extends DecoratableMangaScraper {

    public constructor () {
        super('setsuscans', 'SetsuScans', 'https://manga.saytsu.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('isHuman', JSON.stringify({ valid: true, expiresAt: Number.MAX_SAFE_INTEGER }));`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
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
        const mangas = await this.FetchAPI<APIManga[]>('/mangaloaded?page_size=24&page=' + page);
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>('/manga/' + manga.Identifier);
        return chapters.map(({ slug, chapter_number: number }) => new Chapter(this, manga, slug, 'Chapter ' + number));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { full_image_paths } = await this.FetchAPI<APIPages>(`/manga/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        return full_image_paths.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link, { signal, headers: { Accept: 'human/ok' } });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request('https://api.saytsu.com' + endpoint));
    }
}
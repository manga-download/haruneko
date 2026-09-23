import { Tags } from '../Tags';
import icon from './MugiwaraNoStreaming.webp';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

type APICatalogue = {
    animes: {
        anime: string;
        slug: string;
        disponibles: string[];
    }[];
    pagination: {
        totalPages: number;
    };
};

type APIScansOptions = {
    SCANS_OPTIONS: {
        IMAGE_URL: string;
        versions?: {
            name: string;
            IMAGE_URL: string;
        }[];
    };
};

type APIChapterSizes = Record<string, number> | { error: string };

type ChapterID = {
    scans: string;
    number: string;
};

/**
 * The website is an anime aggregator whose entries additionally provide manga scans.
 * Only the scans are supported here (they are plain images), because the app has no video download pipeline for the episodes.
 */
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly scansCDN = 'https://scans.mugiwara-no-streaming.com';
    // The API answers a plain-text "Trop de requêtes" (too many requests) for bursts, so the requests are serialized and paced.
    private readonly apiPool = new TaskPool(1, new RateLimit(3, 1));

    public constructor() {
        super('mugiwaranostreaming', 'Mugiwara no Streaming', 'https://www.mugiwara-no-streaming.com', Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        const uri = URL.parse(url);
        return uri?.origin === this.URI.origin && /^\/catalogue\/[^/]+\/?$/.test(uri.pathname);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.match(/\/catalogue\/([^/]+)/).at(1);
        const [ title ] = await FetchCSS<HTMLTitleElement>(new Request(url), 'title');
        return new Manga(this, provider, slug, title.text.split('|').at(0).trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, pages = 1; page <= pages; page++) {
                const { animes, pagination } = await this.FetchAPI<APICatalogue>('/api/catalogue-filters', { page, itemsPerPage: 500 });
                pages = pagination.totalPages;
                yield* animes.filter(({ disponibles }) => disponibles.includes('Scans')).map(({ slug, anime }) => new Manga(this, provider, slug, anime));
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // The scans of a title may be published in several versions (e.g. black & white and colored), each with its own name for the scans
        // API and the scans host (neither the slug nor the displayed name of a version are accepted), which the page of the title provides.
        const { SCANS_OPTIONS: options } = await FetchNextJS<APIScansOptions>(new Request(new URL(`/catalogue/${manga.Identifier}`, this.URI)), data => 'SCANS_OPTIONS' in data);
        const versions = [
            { scans: options.IMAGE_URL, label: '' },
            ... (options.versions ?? []).map(({ name, IMAGE_URL: scans }) => ({ scans, label: name.replace(manga.Title, '').trim() || name })),
        ];
        const chapters: Chapter[] = [];
        for (const { scans, label } of versions) {
            // A title which is not in the scans store is answered with `{ error: ... }` => no chapters
            const sizes = await this.FetchAPI<APIChapterSizes>(`/api/taille-proxy?slug=${encodeURIComponent(scans)}`);
            chapters.push(... Object.entries('error' in sizes ? {} : sizes)
                .filter(([ , pages ]) => pages > 0)
                .sort(([ self ], [ other ]) => Number(other) - Number(self))
                .map(([ number ]) => new Chapter(this, manga, JSON.stringify({ scans, number } satisfies ChapterID), `Chapitre ${number}${label ? ` (${label})` : ''}`)));
        }
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { scans, number } = JSON.parse(chapter.Identifier) as ChapterID;
        const sizes = await this.FetchAPI<APIChapterSizes>(`/api/taille-proxy?slug=${encodeURIComponent(scans)}`);
        const pages = 'error' in sizes ? 0 : sizes[number] ?? 0;
        return Array.from({ length: pages }, (_, index) => {
            const link = new URL(`${this.scansCDN}/${encodeURIComponent(scans)}/${number}/${index + 1}.jpg`);
            return new Page(this, chapter, link, { Referer: this.URI.href });
        });
    }

    /**
     * Fetch a JSON endpoint of the website with the same-origin header its WAF requires (otherwise `403`), as `POST` when a {@link body} is given.
     */
    private FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.URI), {
            method: body ? 'POST' : 'GET',
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Sec-Fetch-Site': 'same-origin',
                'Content-Type': 'application/json',
            },
        });
        return this.apiPool.Add(() => FetchJSON<T>(request), Priority.Normal);
    }
}

import { Tags } from '../Tags';
import icon from './MugiwaraNoStreaming.webp';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

type APICatalogue = {
    animes: {
        anime: string;
        slug: string;
    }[];
};

type APIScansOptions = {
    IMAGE_URL: string;
    versions?: {
        name: string;
        IMAGE_URL: string;
    }[];
};

type APIChapterSizes = Record<string, number> | { error: string };

type ChapterID = {
    scans: string;
    number: string;
};

// TODO: Add anime support

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/catalogue\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({ id: uri.pathname.split('/').filter(segment => segment).at(-1), title: meta.content }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly scansCDN = 'https://scans.mugiwara-no-streaming.com';
    private readonly apiPool = new TaskPool(1, new RateLimit(3, 1));

    public constructor() {
        super('mugiwaranostreaming', 'Mugiwara no Streaming', 'https://www.mugiwara-no-streaming.com', Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { animes } = await this.FetchAPI<APICatalogue>('/api/catalogue-filters', { page, itemsPerPage: 500, filteredAvailability: [ 'Scans' ] });
                const mangas = animes.map(({ slug, anime }) => new Manga(this, provider, slug, anime));
                run = mangas.length > 0;
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // The scans of a title may be published in several versions (e.g. black & white and colored), each with its own name for the scans
        // API and the scans host, which the page of the title provides (neither the slug nor the displayed name of a version are accepted).
        const options = await FetchNextJS<APIScansOptions>(new Request(new URL(`/catalogue/${manga.Identifier}`, this.URI)), data => 'IMAGE_URL' in data);
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

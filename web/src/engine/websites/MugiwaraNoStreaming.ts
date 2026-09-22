import { Tags } from '../Tags';
import icon from './MugiwaraNoStreaming.webp';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { Delay } from '../BackgroundTimers';

type Catalogue = {
    catalogues: {
        category: string;
        names: {
            animeName: string;
            slug: string;
            data?: {
                disponibles?: string[];
            };
        }[];
    }[];
};

type ChapterSizes = Record<string, number>;

/**
 * The website is an anime aggregator whose entries additionally provide manga scans.
 * Only the scans are supported here (they are plain images), because the app has no video download pipeline for the episodes.
 * Everything is keyed by the human-readable `animeName` (e.g. `One Piece`): the scan page count comes from `/api/taille-proxy`
 * and the page images are served from the dedicated scans host as `<animeName>/<chapter>/<page>.jpg`.
 */
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly scansCDN = 'https://scans.mugiwara-no-streaming.com';
    // The API rejects bursts with a plain-text "Trop de requêtes" (rate limit), so serialize and pace the requests.
    private readonly apiPool = new TaskPool(1, new RateLimit(3, 1));
    // Cache the per-title page counts so downloading many chapters does not hammer the rate-limited endpoint (refreshed by FetchChapters).
    private readonly sizes = new Map<string, ChapterSizes>();
    // The image CDN is not rate-limited, so the "does this title actually have scans" probe can run with high concurrency.
    private readonly scansCheckPool = new TaskPool(12);

    public constructor() {
        super('mugiwaranostreaming', 'Mugiwara no Streaming', 'https://www.mugiwara-no-streaming.com', Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/catalogue/[^/]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.match(/\/catalogue\/([^/]+)/)?.at(1);
        const entry = (await this.FetchCatalogue()).find(anime => anime.slug === slug);
        if (!entry) {
            throw new Error(`Failed to find a manga for the URL '${url}'`);
        }
        return new Manga(this, provider, entry.animeName, entry.animeName.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const seen = new Set<string>();
        const candidates = (await this.FetchCatalogue())
            .filter(anime => anime.data?.disponibles?.includes('Scans'))
            .filter(anime => !seen.has(anime.animeName) && seen.add(anime.animeName));
        // The catalogue advertises scans for ~half the titles that actually have none, so keep only those whose first page really exists on the CDN.
        const available = await Promise.all(candidates.map(anime => this.HasScans(anime.animeName)));
        return candidates
            .filter((_, index) => available[index])
            .map(anime => new Manga(this, provider, anime.animeName, anime.animeName.trim()));
    }

    private HasScans(animeName: string): Promise<boolean> {
        return this.scansCheckPool.Add(async () => {
            try {
                return (await Fetch(new Request(`${this.scansCDN}/${encodeURIComponent(animeName)}/1/1.jpg`, { method: 'HEAD' }))).ok;
            } catch {
                return false;
            }
        }, Priority.Normal);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const sizes = await this.FetchChapterSizes(manga.Identifier, true);
        return Object.entries(sizes)
            .filter(([ chapter, pages ]) => /^\d/.test(chapter) && Number.isInteger(pages) && pages > 0)
            .sort(([ self ], [ other ]) => parseFloat(other) - parseFloat(self))
            .map(([ chapter ]) => new Chapter(this, manga, chapter, `Chapitre ${chapter}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const animeName = chapter.Parent.Identifier;
        const pageCount = (await this.FetchChapterSizes(animeName))[chapter.Identifier] ?? 0;
        return new Array(pageCount).fill(0).map((_, index) => {
            const link = new URL(`${this.scansCDN}/${encodeURIComponent(animeName)}/${chapter.Identifier}/${index + 1}.jpg`);
            return new Page(this, chapter, link, { Referer: this.URI.href });
        });
    }

    private async FetchCatalogue() {
        const { catalogues } = await this.FetchAPI<Catalogue>('/api/get-catalogues');
        return catalogues.flatMap(category => category.names);
    }

    private async FetchChapterSizes(animeName: string, refresh = false): Promise<ChapterSizes> {
        if (refresh || !this.sizes.has(animeName)) {
            const data = await this.FetchAPI<ChapterSizes | { error: string }>(`/api/taille-proxy?slug=${encodeURIComponent(animeName)}`);
            // The site advertises scans for many titles that are not actually in the scans store; those answer `{ error: ... }` => no chapters.
            this.sizes.set(animeName, data && typeof data === 'object' && !('error' in data) ? data : {});
        }
        return this.sizes.get(animeName);
    }

    /**
     * Fetch a JSON endpoint with the same-origin header the WAF requires (otherwise 403), paced through a rate-limited pool.
     * A burst is answered with a plain-text "Trop de requêtes" instead of JSON, so a body that fails to parse is treated as a rate limit
     * and retried with a growing back-off rather than surfaced as a fatal `SyntaxError`.
     */
    private FetchAPI<T>(path: string, attempts = 4): Promise<T> {
        return this.apiPool.Add(async () => {
            for (let attempt = 1; ; attempt++) {
                try {
                    const request = new Request(new URL(path, this.URI), { headers: { 'Sec-Fetch-Site': 'same-origin' } });
                    return JSON.parse(await (await Fetch(request)).text()) as T;
                } catch (error) {
                    if (attempt >= attempts) {
                        throw error;
                    }
                    await Delay(attempt * 1000);
                }
            }
        }, Priority.Normal);
    }
}

import { Tags } from '../Tags';
import icon from './MugiwaraNoStreaming.webp';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS } from '../platform/FetchProvider';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

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
 * A manga is identified by its slug (as provided by the catalogue), but the scans API and the scans host are keyed by the
 * human-readable name of the title (e.g. `One Piece`), which is therefore taken from the title of the manga.
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
        const [ element ] = await FetchCSS<HTMLTitleElement>(new Request(url), 'title');
        return new Manga(this, provider, slug, element.text.split('|').at(0).trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { catalogues } = await this.FetchAPI<Catalogue>('/api/get-catalogues');
        return catalogues
            .flatMap(category => category.names)
            .filter(anime => anime.data?.disponibles?.includes('Scans'))
            .map(anime => new Manga(this, provider, anime.slug, anime.animeName.trim()))
            .distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const sizes = await this.FetchChapterSizes(manga.Title);
        return Object.entries(sizes)
            .filter(([ chapter, pages ]) => /^\d+(?:\.\d+)?$/.test(chapter) && Number.isInteger(pages) && pages > 0)
            .sort(([ self ], [ other ]) => parseFloat(other) - parseFloat(self))
            .map(([ chapter ]) => new Chapter(this, manga, chapter, `Chapitre ${chapter}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const title = chapter.Parent.Title;
        const pages = (await this.FetchChapterSizes(title))[chapter.Identifier] ?? 0;
        return Array.from({ length: pages }, (_, index) => {
            const link = new URL(`${this.scansCDN}/${encodeURIComponent(title)}/${chapter.Identifier}/${index + 1}.jpg`);
            return new Page(this, chapter, link, { Referer: this.URI.href });
        });
    }

    private async FetchChapterSizes(title: string): Promise<ChapterSizes> {
        const data = await this.FetchAPI<ChapterSizes | { error: string }>(`/api/taille-proxy?slug=${encodeURIComponent(title)}`);
        // The catalogue advertises scans for many titles which are not in the scans store, those are answered with `{ error: ... }` => no chapters
        return 'error' in data ? {} : data;
    }

    /**
     * Fetch a JSON endpoint of the website with the same-origin header its WAF requires (otherwise `403`), paced through {@link apiPool}.
     */
    private FetchAPI<T>(path: string): Promise<T> {
        return this.apiPool.Add(async () => {
            const request = new Request(new URL(path, this.URI), { headers: { 'Sec-Fetch-Site': 'same-origin' } });
            return JSON.parse(await (await Fetch(request)).text()) as T;
        }, Priority.Normal);
    }
}

import { Tags } from '../Tags';
import icon from './NoxManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    comics: APIManga[];
};

type APIManga = {
    slug: string;
    title: string;
};

type APIChapters = {
    chapters: APIChapter[];
};

type APIChapter = {
    number: number;
    title: string | null;
    id: string;
    pages: {
        image_url: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.detail-info-section .detail-title', (el, uri) => ({ id: uri.pathname.split('/').at(-1), title: el.textContent.trim() }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://xodneo.site/api/v1/';
    private readonly siteId = '00000000-0000-0000-0000-000000000003';

    public constructor() {
        super('noxmanga', 'NoxManga', 'https://noxmanga.co', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //do nothing.. website never initialize properly
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { comics } = await this.FetchAPI<APIMangas>(`./comics?page=${page}`);
                const mangas = comics.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters: chaptersData } = await this.FetchAPI<APIChapters>(`./comics/slug/${manga.Identifier}/chapters?per_page=10000&sort=newest`);
        return chaptersData.map(({ number, title, id }) => new Chapter(this, manga, id, ['Capítulo', number, title ?? ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIChapter>(`./chapters/${chapter.Identifier}?skip_view=true`);
        return pages.map(({ image_url: url }) => new Page(this, chapter, new URL(url)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'X-Site-Id': this.siteId,
            }
        }));
    }
}

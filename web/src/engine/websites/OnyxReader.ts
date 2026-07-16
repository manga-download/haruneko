import { Tags } from '../Tags';
import icon from './Roxinha.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, type Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    title: string;
    slug: string;
};

type APIPages = {
    pageToken: string;
    pages: {
        pageNumber: number;
    }[];
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname,
    title: meta.content.split('—').at(0).trim()
}))
@Common.ChaptersSinglePageJS(`window.CHAPTERS_LIST.map(({ id, number}) => ({ id, title: 'Capítulo '+ number}));`, 500)
@Common.ImageElement(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('onyxreader', 'Onyx Reader', 'https://onyxreader.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { data } = await this.FetchAPI<{ data: APIManga[]; }>(`./mangas?limit=500&includeNsfw=true&page=${page}`);
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `/mangas/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages, pageToken } = await this.FetchAPI<APIPages>(`./read/${chapter.Identifier}`);
        return pages.map(({ pageNumber }) => new Page(this, chapter, new URL(`./p/${pageToken}/${pageNumber}`, this.apiURL), {
            Referer: this.URI.href
        }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'X-Skip-Encrypt': 'true'
            }
        }));
    }
}
import { Tags } from '../Tags';
import icon from './TopManhua.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIResult<T> = {
    items: T;
};

type APIMedia = {
    path: string;
    title: string;
};

type HydratedMangas = {
    initial: {
        items: APIMedia[];
    };
};

@Common.MangaCSS(/^{origin}\/manh(u|w)a\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.PagesSinglePageCSS('section[data-window-chapter] div.reader-content figure img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('topmanhua', 'Top Manhua', 'https://manhuatop.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        //genius API dont let us start with page 1

        const { initial: { items } } = await FetchNextJS<HydratedMangas>(new Request(new URL('/series/', this.URI)), data => 'initial' in data);
        const initialMangas = items.map(({ path, title }) => new Manga(this, provider, path, title));

        type This = typeof this;
        const paginatedMangas = await Array.fromAsync(async function* (this: This) {
            for (let page = 2, run = true; run; page++) {
                const items = await this.FetchAPI<APIMedia[]>(`./discovery?path=/series/page/${page}/`);
                const mangas = items.map(({ path, title }) => new Manga(this, provider, path, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));

        return [...initialMangas, ...paginatedMangas];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;

        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {

                const params = new URLSearchParams({
                    resource: 'chapters',
                    path: `${manga.Identifier}?tab=chapters&chapter_page=${page}`
                });

                const items = await this.FetchAPI<APIMedia[]>(`./reader?${params}`);
                const chapters = items.map(({ path, title }) => new Chapter(this, manga, path, title));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                Accept: 'application/json',
                Referer: this.URI.href,
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'no-cors'
            }
        }))).items;
    }
}
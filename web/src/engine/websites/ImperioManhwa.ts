import { Tags } from '../Tags';
import icon from './ImperioManhwa.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type APIResult<T> = {
    props: T;
};

type APIManga = {
    url: string;
    title: string;
};

type APIMangas = APIResult<{
    series: APIManga[];
}>;

type APIChapters = {
    items: {
        url: string;
        label: string;
    }[];
    last: number;
};

@Common.MangaCSS(/^{origin}\/manga\/[^\/]+\/$/, 'main nav span:last-of-type')
@Common.PagesSinglePageJS(`[...document.querySelectorAll('main.reader-pages div img[srcset]')].map(ele => ele.srcset.split(' ').at(0));`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperiomanhwa', 'Imperio Manhwa', 'https://imperiomanhwa.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(500);
                const { props: { series } } = await this.FetchAPI<APIMangas>(`/manga/page/${page}/`);
                const mangas = series.map(({ url, title }) => new Manga(this, provider, url, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items, last } = await FetchJSON<APIChapters>(new Request(new URL(`${manga.Identifier}capitulos/${page}.json`, this.URI)));
                const chapters = items.map(({ url, label }) => new Chapter(this, manga, url, label));
                yield* chapters;
                run = page != last;
            }
        }.call(this));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return await FetchJSON<T>(new Request(new URL(endpoint, this.URI), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Inertia': 'true',
                'X-Inertia-Version': '6edc82221c3e7ec0196f9fa9bff4a00d',
            }
        }));
    }
}
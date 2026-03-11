import { Tags } from '../Tags';
import icon from './SoftKomik.webp';
import * as Common from './decorators/Common';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangaDetails = {
    pageProps: {
        data: APIManga;
    }
 };

type APIManga = {
    title: string;
    title_slug: string;
};

type APIChapters = {
    chapter: {
        chapter: string;
    }[]
};

type APIMangas = {
    pageProps: {
        data: {
            data: APIManga[];
        }
    }
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.container-img img')].map(image=> image.src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private nextBuild = '';
    private readonly apiUrl = 'https://v2.softkomik.com/';

    public constructor() {
        super('softkomik', `Softkomik`, 'https://softkomik.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript<string>(new Request(this.URI), `__NEXT_DATA__.buildId`, 5000);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const { pageProps: { data: { title, title_slug } } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/${slug}.json`, this.URI)));
        return new Manga(this, provider, title_slug, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run && page; page++) {
                const { pageProps: { data: { data } } } = await FetchJSON<APIMangas>(new Request(new URL(`/_next/data/${this.nextBuild}/komik/list.json?page=${page}`, this.URI)));
                const mangas = data.map(({ title, title_slug: slug }) => new Manga(this, provider, slug, title.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapter: chapters } = await FetchJSON<APIChapters>(new Request(new URL(`./komik/${manga.Identifier}/chapter?limit=9999999`, this.apiUrl)));
        return chapters.map(({ chapter }) => new Chapter(this, manga, `/${manga.Identifier}/chapter/${chapter}`, chapter)).distinct();
    }
}
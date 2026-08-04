import { Tags } from '../Tags';
import icon from './YomuMangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type APIManga = {
    id: number;
    slug: string;
    title: string;
};

type APIMangas = {
    mangas: APIManga[];
};

type HydratedManga = {
    chapters: {
        chapter: string;
    }[];
    media: APIManga;
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('li[data-type="page"] img')].map(img => img.src);`, 1500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.yomumangas.com/';

    public constructor() {
        super('yomumangas', 'Yomu Mangas', 'https://yomumangas.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/mangas/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { media: { id, slug, title } } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'chapters' in data);
        return new Manga(this, provider, `/mangas/${id}/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(1000);
                const { mangas: mangasData } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?query=&page=${page}`, this.apiURL)));
                const mangas = mangasData.map(({ id, title, slug }) => new Manga(this, provider, `/mangas/${id}/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedManga>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.reverse().map(({ chapter }) => new Chapter(this, manga, `${manga.Identifier}/${chapter}`, `Ch. ${chapter}`));
    }
}
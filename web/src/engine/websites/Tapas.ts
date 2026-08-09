import { Tags } from '../Tags';
import icon from './Tapas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        items: APIManga[];
    };
};

type APISingleManga = {
    data: {
        id: number,
        title: string;
    };
};

type APIManga = {
    seriesId: number,
    title: string;
};

type APIChapters = {
    data: {
        episodes: {
            id: number,
            title: string;
        }[];
    };
};

@Common.PagesSinglePageCSS('article.viewer__body img.content__img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://story-api.tapas.io/cosmos/api/v1/landing/';

    public constructor() {
        super('tapas', `Tapas`, 'https://tapas.io', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const seriesId = (await FetchCSS<HTMLMetaElement>(new Request(url), 'meta[property="al:android:url"]')).at(0).content.replace(/\/info$/, '').split('/').at(-1);
        const { data: { id, title } } = await FetchJSON<APISingleManga>(new Request(new URL(`./series/${seriesId}?`, this.URI), {
            headers: {
                Accept: 'application/json, text/javascript, */*;',
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { data: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./genre?category_type=COMIC&size=200&page=${page}`, this.apiUrl)));
                const mangas = items.map(({ seriesId, title }) => new Manga(this, provider, `${seriesId}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }

        }.call(this));

    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { episodes } } = await FetchJSON<APIChapters>(new Request(new URL(`./series/${manga.Identifier}/episodes?page=${page}`, this.URI)));
                const chapters = episodes.map(({ id, title }) => new Chapter(this, manga, `/episode/${id}`, title));
                chapters.length > 0 ? yield* chapters : run = false;
            }

        }.call(this));
    }
}
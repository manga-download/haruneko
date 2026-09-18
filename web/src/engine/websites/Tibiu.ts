import { Tags } from '../Tags';
import icon from './Tibiu.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, Chapter, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIMangaDetails = APIResult<APIManga>

type APIManga = {
    id: number | string;
    name: string;
};

type APIMangas = APIResult<APIManga[]>;

type APIChapters = APIResult<{
    id: string;
    name: string;
}[]>;

type APIPages = APIResult<{
    img: string;
}[]>;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comic.tibiu.net/index.php/api/';

    public constructor() {
        super('tibiu', 'Tibiu', 'https://comic.tibiu.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('adult', '1');window.cookieStore.set('cadult', '1');window.cookieStore.set('tibiu_age_confirmed', '1');`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id, name } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./comic/detail?mid=${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./data/comic?page=${page}`, this.apiURL)));
                const mangas = data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIChapters>(new Request(new URL(`./comic/chapter?mid=${manga.Identifier}`, this.apiURL)));
        return data.map(({ id, name }) => new Chapter(this, manga, id, name)).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data } = await FetchJSON<APIPages>(new Request(new URL(`./data/pic?cid=${chapter.Identifier}`, this.apiURL)));
        return data.map(({ img }) => new Page(this, chapter, new URL(img, this.URI)));
    }
}
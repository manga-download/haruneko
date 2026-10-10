import { Tags } from '../Tags';
import icon from './ArabToons.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIResults<T> = APIResult<{
    items: T[];
}>;

type APIMangaDetails = APIResult<{
    mangaDetails: APIManga;
}>;

type APIMangas = APIResults<APIManga>;

type APIManga = {
    id: number;
    title: string;
    slug: string;
};

type APIChapters = APIResults<{
    slug: string;
    number: number;
}>;

type APIPages = APIResult<{
    mangaDir: string;
    chapterDir: string;
    images: {
        name: string;
    }[];
}>;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('arabtoons', 'ArabToons', 'https://arabtoons.net', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Arabic, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { mangaDetails: { id, title, slug } } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./browse?page=${page}`, this.apiURL)));
                const mangas = items.map(({ id, slug, title }) => new Manga(this, provider, `${id}/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [id, ] = manga.Identifier.split('/');
        const { data: { items } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${id}/chapters`, this.apiURL)));
        return items.map(({ slug, number }) => new Chapter(this, manga, slug, `${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [, slug] = chapter.Parent.Identifier.split('/');
        const { data: { images, chapterDir, mangaDir } } = await FetchJSON<APIPages>(new Request(new URL(`./manga/${slug}/${chapter.Identifier}`, this.apiURL)));
        return images.map(({ name }) => new Page(this, chapter, new URL(`/storage/mangas/${mangaDir}/${chapterDir}/${name}`, this.URI)));
    }
}
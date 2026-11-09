import { Tags } from '../Tags';
import icon from './MangaDiyari.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    title: string;
    slug: string;
};

type APIMangaDetails = {
    series: APIManga;
    chapters: {
        id: number;
        title: string;
    }[];
}

type APIMangas = {
    series: APIManga[];
};

type APIPages = {
    pages: {
        image_path: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangadiyari', 'MangaDiyari', 'https://mangadiyari.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { series } = await FetchJSON<APIMangas>(new Request(new URL(`./series?page=${page}&limit=200`, this.apiURL)));
                const mangas = series.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/seri/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { series: { id, title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ id, title }) => new Chapter(this, manga, `${id}`, title)).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ image_path: image }) => new Page(this, chapter, new URL(image, this.URI)));
    }
}
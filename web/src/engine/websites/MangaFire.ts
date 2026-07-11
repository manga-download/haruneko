import { Tags } from '../Tags';
import icon from './MangaFire.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResults<T> = {
    items: T[];
};

type APIManga = {
    hid: string;
    title: string;
};

type APIChapter = {
    id: number;
    number: number;
    name: string;
    language: string;
    type: string;
    pages: {
        url: string;
    }[];
};

type APIMangas = APIResults<APIManga>;
type APIChapters = APIResults<APIChapter>;

const chapterLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-la', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['ja', Tags.Language.Japanese],
    ['pt-br', Tags.Language.Portuguese]
]);

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangafire', 'MangaFire', 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/[^/]+$`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIMangas>(new Request(new URL(`./titles?page=${page}&limit=100`, this.apiURL)));
                const mangas = items.map(({ hid, title }) => new Manga(this, provider, hid, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { hid, title } } = await FetchJSON<{ data: APIManga }>(new Request(new URL(`./titles/${url.match(/\/title\/([^-]+)/).at(1)}`, this.apiURL)));
        return new Manga(this, provider, hid, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { items } = await FetchJSON<APIChapters>(new Request(new URL(`./titles/${manga.Identifier}/volumes`, this.apiURL)));
        const volumes = items.map(({ id, language, name, number }) => new Chapter(this, manga, `volumes/${id}`, [`Vol. ${number}`, name, `(${language})`].joinTitleSegments(), ...[chapterLanguageMap.get(language)].filter(Boolean)));

        const chapters = await Array.fromAsync(async function* () {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIChapters>(new Request(new URL(`./titles/${manga.Identifier}/chapters?sort=number&order=desc&page=${page}&limit=200`, this.apiURL)));
                const chapters = items.map(({ id, language, name, number, type }) => new Chapter(this, manga, `chapters/${id}`, [`Ch. ${number}`, name, `(${type})`, `(${language})`].joinTitleSegments(), ...[chapterLanguageMap.get(language)].filter(Boolean)));
                chapters.length > 0 ? yield* chapters : run = false ;
            }
        }.call(this));
        return [...chapters, ...volumes];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { pages } } = await FetchJSON<{ data: APIChapter }>(new Request(new URL(`./${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}
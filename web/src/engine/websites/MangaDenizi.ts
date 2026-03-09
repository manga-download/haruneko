import { Tags } from '../Tags';
import icon from './MangaDenizi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONAPPData<T> = {
    props: T;
};

type JSONManga = {
    manga: {
        title: string;
        slug: string;
        chapters: JSONChapter[];
    };
};

type JSONMangas = {
    manga: {
        data: {
            title: string;
            slug: string;
        }[];
    }
};

type JSONChapter = {
    number: number;
    title: string;
};

type JSONPages = {
    pages: {
        image_url: string;
        //scrambled_url: string;
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadenizi', 'Manga Denizi', 'https://www.mangadenizi.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { title, slug } } = await this.FetchAPP<JSONManga>(url);
        return new Manga(this, provider, `/manga/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { manga: { data } } = await this.FetchAPP<JSONMangas>(`./manga?page=${page}`);
                const mangas = data.map(({ title, slug }) => new Manga(this, provider, `/manga/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { chapters } } = await this.FetchAPP<JSONManga>(manga.Identifier);
        return chapters.map(({ number, title }) => new Chapter(this, manga, `${manga.Identifier.replace('/manga/', '/read/')}/${number}`, ['Bölüm', `${number}:`, title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPP<JSONPages>(chapter.Identifier);
        return pages.map(({ image_url: url }) => new Page(this, chapter, new URL(url)));
    }

    private async FetchAPP<T extends JSONElement>(endpoint: string): Promise<T> {
        const data = JSON.parse((await FetchCSS(new Request(new URL(endpoint, this.URI)), '#app')).at(0).dataset.page) as JSONAPPData<T>;
        return data.props as T;
    }
}
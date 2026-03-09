import { Tags } from '../Tags';
import icon from './ManhwaEighteen.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONAPPData<T> = {
    props: T;
};

type JSONManga = {
    manga: JSONMedia;
};

type JSONMangas = {
    paginate: {
        data: JSONMedia[];
    }
};

type JSONMedia = {
    name: string;
    slug: string;
};

type JSONChapters = {
    chapters: JSONMedia[];
};

type JSONPages = {
    chapterContent: string;
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa18-int', 'Manhwa 18 (.net)', 'https://manhwa18.net', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { name, slug } } = await this.FetchAPP<JSONManga>(url);
        return new Manga(this, provider, `/manga/${slug}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { paginate: { data } } = await this.FetchAPP<JSONMangas>(`./manga-list?page=${page}`);
                const mangas = data.map(({ slug, name }) => new Manga(this, provider, `/manga/${slug}`, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPP<JSONChapters>(manga.Identifier);
        return chapters.map(({ slug, name }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapterContent } = await this.FetchAPP<JSONPages>(chapter.Identifier);
        return [...new DOMParser().parseFromString(chapterContent, 'text/html').querySelectorAll<HTMLImageElement>('img')].map(img => new Page(this, chapter, new URL(img.src)));
    }

    private async FetchAPP<T extends JSONElement>(endpoint: string): Promise<T> {
        const data = JSON.parse((await FetchCSS(new Request(new URL(endpoint, this.URI)), '#app')).at(0).dataset.page) as JSONAPPData<T>;
        return data.props as T;
    }
}
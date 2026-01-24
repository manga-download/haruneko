import { Tags } from '../Tags';
import icon from './ManhwaWeb.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: APIManga[];
    next: boolean;
};

type APIManga = {
    _id: string;
    the_real_name: string;
    chapters: APIChapter[];
};

type APIChapter = {
    link: string;
    chapter: number;
    img: string[];
};

type APIPages = {
    chapter: APIChapter;
};

@Common.ImageAjax(undefined, true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://manhwawebbackend-production.up.railway.app';

    public constructor () {
        super('manhwaweb', 'ManhwaWeb', 'https://manhwaweb.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(manga|manhwa)/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').pop();
        const { the_real_name } = await FetchJSON<APIManga>(new Request(new URL(`./manhwa/see/${slug}`, this.apiUrl)));
        return new Manga(this, provider, slug, the_real_name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./manhwa/library?estado=&tipo=&erotico=&demografia=&page=${page}`, this.apiUrl)));
                const mangas = data.map(({ _id, the_real_name: name }) => new Manga(this, provider, _id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./manhwa/see/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(chapter => new Chapter(this, manga, chapter.link.split('/').pop(), chapter.chapter.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { img } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/see/${chapter.Identifier}`, this.apiUrl)));
        return img.filter(page => page).map(page => new Page(this, chapter, new URL(page)));
    }
}
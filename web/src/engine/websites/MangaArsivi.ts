import { Tags } from '../Tags';
import icon from './MangaArsivi.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    slug: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: string;
    number: number;
    title: string;
    images: string[];
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangaarsivi', 'Manga Arşivi', 'https://manga-arsivi.com.tr', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), `localStorage.setItem('security_verified_time', '${Date.now() + 3600 * 1000}')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchJSON<APIManga>(new Request(new URL(`./mangas/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./mangas', this.apiUrl)));
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./mangas/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(({ id, title, number }) => new Chapter(this, manga, id, [number, title].filter(Boolean).join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = (await FetchJSON<APIManga>(new Request(new URL(`./mangas/${chapter.Parent.Identifier}`, this.apiUrl)))).chapters.find(({ id }) => chapter.Identifier === id);
        return images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }
}
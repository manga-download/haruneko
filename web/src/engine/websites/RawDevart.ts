import { Tags } from '../Tags';
import icon from './RawDevart.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    manga_id: number
    manga_name: string
}

type APIMangas = {
    manga_list: APIManga[]
}

type APISingleManga = {
    detail: APIManga,
    chapters: APIChapter[]
}

type APIChapter = {
    chapter_id: string,
    chapter_title: string,
    chapter_number: number
}

type APIPages = {
    chapter_detail: {
        chapter_content: string,
        server: string
    }
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = this.URI.origin + '/spa/';

    public constructor() {
        super('rawdevart', `RawDevart`, 'https://rawdevart.art', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+-c\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.match(/-c(\d+)$/).at(1);
        const { detail: { manga_id, manga_name } } = await FetchJSON<APISingleManga>(new Request(new URL(`manga/${id}`, this.apiUrl)));
        return new Manga(this, provider, manga_id.toString(), manga_name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangalist.isMissingLastItemFrom(mangas) ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { manga_list } = await FetchJSON<APIMangas>(new Request(new URL(`latest-manga?page=${page}`, this.apiUrl)));
        return manga_list.map(manga => new Manga(this, provider, manga.manga_id.toString(), manga.manga_name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APISingleManga>(new Request(new URL(`manga/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(chapter => new Chapter(this, manga, chapter.chapter_number.toString(), [chapter.chapter_number, chapter.chapter_title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter_detail: { chapter_content, server } } = await FetchJSON<APIPages>(new Request(new URL(`manga/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl)));
        const dom = new DOMParser().parseFromString(chapter_content, 'text/html');
        return [...dom.querySelectorAll<HTMLCanvasElement>('canvas[data-srcset]')].map(page => new Page(this, chapter, new URL(page.dataset.srcset, server)));
    }
}
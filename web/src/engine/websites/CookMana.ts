import { Tags } from '../Tags';
import icon from './CookMana.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    id: string,
    title: string
}

type APIChapter = {
    id: string,
    title: string
}

type APIPage = {
    folder: string,
    folder2: string | null,
    folder3: string,
    id: string,
    parentId: string,
    urls: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly cdn1 = 'https://www.11angle.net/';
    private readonly cdn2 = 'https://www.pl3040.com/';

    public constructor() {
        super('cookmana', 'CookMana', 'https://cookmana.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/episode/\\d+/1/1$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await FetchWindowScript<APIManga>(new Request(new URL(url)), 'coverData');
        return new Manga(this, provider, data.id, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchWindowScript<APIManga[]>(new Request(new URL(`/lastest/${page}/0`, this.URI)), 'lastestList');
        return data?.map(item => new Manga(this, provider, item.id, item.title.trim())) ?? [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(`/episode/${manga.Identifier}/${page}/1`, this.URI);
        const data = await FetchWindowScript<APIChapter[]>(new Request(url), 'episodeList');
        return data?.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.replace(manga.Title, '').trim())) ?? [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/detail/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
        const data = await FetchWindowScript<APIPage>(new Request(url), 'toonsDetail');
        return this.ComputeImagesUrl(data)?.map(page => new Page(this, chapter, page)) ?? [];
    }

    private ComputeImagesUrl(data: APIPage): URL[] {
        const urls = data.urls?.split(',');
        if (data.folder2 != '') {
            data.folder2 = data.folder2.split('/').shift();
        }
        return urls?.map(page => {
            if (data.folder2 != '') {
                page = page.split('/').pop();
                return new URL(`${this.cdn2}/kr/${data.folder2}/${data.parentId}/${data.id}/${page}`);
            } else {
                return data.folder ? new URL(`${this.cdn1}/image_pst-123/${data.folder}/${data.parentId}/${page}`) : new URL(`${this.cdn1}/toon_pst-123/${page}`);
            }
        }) ?? [];
    }
}
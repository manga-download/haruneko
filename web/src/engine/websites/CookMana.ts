import { Tags } from '../Tags';
import icon from './AdonisFansub.webp';
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
    folder2: string,
    folder3: string,
    id: string,
    parentId: string,
    urls: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly dnsSrc = 'https://www.11angle.net/';
    private readonly dnsSrc2 = 'https://www.pl3040.com/';

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
        return data ? data.map(item => new Manga(this, provider, item.id, item.title.trim())) : [];
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
        return data ? data.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.replace(manga.Title, '').trim())) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/detail/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
        const { urls, folder, parentId, folder2, id } = await FetchWindowScript<APIPage>(new Request(url), 'toonsDetail');
        return urls ? urls.split(",").map(item => new Page(this, chapter, this.ComputeImageUrl(folder, item, parentId, id, folder2))) : [];
    }

    private ComputeImageUrl(folder: string, url: string, parentId: string, id: string, folder2: string = ""): URL {
        let ret = folder ? `${this.dnsSrc}/image_pst-123/${folder}/${parentId}/${url}` : `${this.dnsSrc}/toon_pst-123/${url}`;
        if (folder2 != '') {
            url = url.split('/').pop();
            folder2 = folder2.split('/').shift();
            ret = `${this.dnsSrc2}/kr/${folder2}/${parentId}/${id}/${url}`;
        }
        return new URL(ret);
    }
}
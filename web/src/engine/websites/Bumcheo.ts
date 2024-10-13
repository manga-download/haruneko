import { Tags } from '../Tags';
import icon from './Bumcheo.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        items: APIManga[]
    }
}

type APIManga = {
    title: string,
    hashId: string,
    chapters?: APIChapter[]
}

type APIMangaDetails = {
    data : APIManga
}

type APIChapter = {
    title: string
    order: number
}

type APIPages = {
    data : {
        files: {
            url : string
        }[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api-web.bumcheo.vn/api/comic/comic/';

    public constructor() {
        super('bumcheo', `Bumcheo`, 'https://bumcheo.vn', Tags.Language.Vietnamese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/series\\?id=[a-zA-Z0-9]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const seriesId = new URL(url).searchParams.get('id');
        const { data: { hashId, title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`${seriesId}/`, this.apiUrl)));
        return new Manga(this, provider, hashId, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`list?pageNumber=${page}&pageSize=50`, this.apiUrl)));
        return items.map(item => new Manga(this, provider, item.hashId, item.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`${manga.Identifier}/`, this.apiUrl)));
        return !chapters ? [] : chapters.map(item => new Chapter(this, manga, item.order.toString(), `Chap ${item.order}: ${item.title}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { files } } = await FetchJSON<APIPages>(new Request(new URL(`${chapter.Parent.Identifier}/chapter/${chapter.Identifier}/`, this.apiUrl)));
        return files.map(item => new Page(this, chapter, new URL(item.url)));
    }

}
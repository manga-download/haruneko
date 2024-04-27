import { Tags } from '../Tags';
import icon from './SenManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const mangasPerPage = 100;

type JSONManga = {
    id: string,
    title: string,
    description: string,
    language: {
        name: string,
        code: string
    }
}

type JSONChapter = {
    id: string,
    chapter : string,
    full_title: string
    pages: number,
    series : string,
    language: {
        name: string,
        code: string
    }
}

type APISingleManga = {
    success: boolean
    data: JSONManga
}

type APIMultiManga = {
    success: boolean
    data: JSONManga[]
}

type APIMultiChapter = {
    success: boolean
    data: JSONChapter[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('senmanga', `SenManga`, 'https://www.senmanga.com', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('viewer', '1')`);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/title/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').pop();
        const uri = new URL('/api/title/' + id, this.URI).href;
        const request = new Request(uri);
        const data = await FetchJSON<APISingleManga>(request);
        return new Manga(this, provider, data.data.id, data.data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (let page = 0, run = true; run; page+= mangasPerPage) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async GetMangasFromPage(offset: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/api/search?limit=' + mangasPerPage + '&offset=' + offset, this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<APIMultiManga>(request);
        return data.success ? data.data.map(element => new Manga(this, provider, element.id, element.title.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL('/api/title/' + manga.Identifier +'/chapters', this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<APIMultiChapter>(request);
        return data.success ? data.data.map(element => new Chapter(this, manga, '/read/' + element.id, element.full_title.trim() + ' (' + element.language.code + ')')) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await Common.FetchPagesSinglePageJS.call(this, chapter, '__NEXT_DATA__.props.pageProps.chapter.pageList.url', 500);
        return images.map(page => new Page(this, chapter, page.Link, { Referer: page.Link.origin }));
    }
}
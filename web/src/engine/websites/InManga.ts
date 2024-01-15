import { Tags } from '../Tags';
import icon from './InManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIChapters = {
    data: string;
}

type APIChapter = {
   result : {
        Identification: string,
        FriendlyChapterNumber: string
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('inmanga', `InManga`, 'https://inmanga.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    private createPostRequest(uri: string, form: string) {
        const request = new Request(uri, {
            body: form, method: 'POST', headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': this.URI.href
            }
        });
        return request;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/ver/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga>{
        const id = url.split('/').pop();
        const request = new Request(url);
        const title = await FetchCSS<HTMLHeadingElement>(request, 'div.panel-heading h1');
        return new Manga(this, provider, id, title[0].textContent);

    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('/manga/getMangasConsultResult', this.URI);
        const formManga = new URLSearchParams({
            'filter[generes][]': '-1',
            'filter[queryString]': '',
            'filter[skip]': String(500 * page),
            'filter[take]': '500',
            'filter[sortby]': '5',
            'filter[broadcastStatus]': '0',
            'filter[onlyFavorites]': 'false',
            'd': '',
        }).toString();

        const request = this.createPostRequest(uri.href, formManga);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a.manga-result');
        return data.map(element => {
            const id = element.href.split('/').filter(part => part !== '').pop();
            const title = element.querySelector<HTMLHeadingElement>('h4.ellipsed-text').textContent.trim();
            return new Manga(this, provider, id, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL('/chapter/getall', this.URI);
        uri.searchParams.set('mangaIdentification', manga.Identifier);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIChapters>(request);
        const data2: APIChapter = JSON.parse(data.data);
        return data2.result.map(item => new Chapter(this, manga, item.Identification, item.FriendlyChapterNumber));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/chapter/chapterIndexControls', this.URI);
        uri.searchParams.set('identification', chapter.Identifier);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLImageElement>(request, 'div.PagesContainer img.ImageContainer');
        return data.map(element => new Page(this, chapter, new URL('/page/getPageImage/?identification=' + element.id, request.url)));
    }

}

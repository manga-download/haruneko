import { Tags } from '../Tags';
import icon from './Shakai.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    create: number,
    description: string,
    page: string,
    respond: string;
    result: {
        'output-id': string,
        'output-link': string,
        'output-name': string,
    }[]
}

type APIPages = {
    respond: string;
    data: {
        'data-first': string; //chapter id
        'data-second': string[] //pages url
    }[]

}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shakai', `Shakai`, 'http://shakai.ru', Tags.Language.Russian, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.match(/\/manga\/(\d+)$/)[1];
        const request = new Request(url);
        const data = await FetchCSS<HTMLHeadingElement>(request, 'div.main__block div.wrapper__heading h1');
        return new Manga(this, provider, id, data[0].textContent.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/take/catalog/request/shakai', this.URI);
        const form = new FormData();
        form.append('dataRun', 'catalog');
        form.append('selectCatalog', 'manga');
        form.append('itemMarker', new Date(Date.now()).toISOString().replace('T', ' '));
        form.append('searchData', '');
        form.append('selectPage', String(page));
        const request = new Request(url.href, {
            method: 'POST',
            body: form,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await FetchJSON<APIMangas>(request);
        return data.respond == "true" ? data.result.map(manga => new Manga(this, provider, manga['output-id'], manga['output-name'].trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL('/take/api-manga/request/shakai', this.URI);
        const form = new FormData();
        form.append('dataRun', 'api-manga');
        form.append('dataRequest', manga.Identifier);
        const request = new Request(url.href, {
            method: 'POST',
            body: form,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const { data } = await FetchJSON<APIPages>(request);
        return data.map(chapter => new Chapter(this, manga, chapter['data-first'], chapter['data-first']));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL('/take/api-manga/request/shakai', this.URI);
        const form = new FormData();
        form.append('dataRun', 'api-manga');
        form.append('dataRequest', chapter.Parent.Identifier);
        const request = new Request(url.href, {
            method: 'POST',
            body: form,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await FetchJSON<APIPages>(request);
        if (data.respond != "true") return [];
        const goodchapter = data.data.find(element => element['data-first'] == chapter.Identifier);
        if (!goodchapter) return [];
        return goodchapter['data-second'].map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}
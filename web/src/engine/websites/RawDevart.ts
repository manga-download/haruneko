import { Tags } from '../Tags';
import icon from './RawDevart.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

const apiUrl = 'https://api.endevart.com/api/';

type JSONManga = {
     id: string, language_name: string, title: string, language: string
}

type JSONMangas = {
    results: JSONManga[]
}
type JSONChapters = {
    results: { id: string, language_name: string, chapter_number: string, cstr_full: string, language: string, name: string }[]
}

type JSONPages = {
    pages: { id: string, image : string }[]
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private generateKey(): string {
        const anonkey = String('anon_______y____').split('').map(e => '_' === e ? function () {
            let t = '';
            const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const n = r.length;
            for (let o = 0; o < 1; o++) t += r.charAt(Math.floor(Math.random() * n));
            return t;
        }() : e).join('');
        return anonkey;
    }

    public constructor() {
        super('rawdevart', `RawDevart`, 'https://endevart.com', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    private generateRequest(url: string): Request {
        return new Request(url, {
            headers: {
                'Referer': this.URI.href,
                'Origin': this.URI.href,
                'X-ReadAuth': this.generateKey(),
            }
        });
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/[-0-9a-fA-F]{36}$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, _url: string): Promise<Manga> {
        const id = _url.split('/').pop();
        const url = new URL(`/api/comic/${id}/`, apiUrl).href;
        const request = this.generateRequest(url);
        const data = await FetchJSON<JSONManga>(request);
        return new Manga(this, provider, data.id, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL(`/api/comic/?page_size=50&page=${page}`, apiUrl).href; // 50 only and maybe less, website gives timeout
        const request = this.generateRequest(url);
        const data = await FetchJSON<JSONMangas>(request);
        return data.results? data.results.map(element => new Manga(this, provider, element.id, element.title.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`/api/chapter/?page_size=9999&comic=${manga.Identifier}&page=1`, apiUrl).href;
        const request = this.generateRequest(url);
        const data = await FetchJSON<JSONChapters>(request);
        return data.results ? data.results.map(element => new Chapter(this, manga, element.id, element.cstr_full.trim())) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/api/chapter/${chapter.Identifier}/?page_size=1000&fields=pages,pages.id,pages.order_number,pages.image_height,pages.image_width,pages.image&expand=pages`, apiUrl).href;
        const request = this.generateRequest(url);
        const data = await FetchJSON<JSONPages>(request);
        return data.pages.map(element => new Page(this, chapter, new URL(element.image)));
    }
}

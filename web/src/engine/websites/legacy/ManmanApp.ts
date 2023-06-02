import { Tags } from '../../Tags';
import icon from './ManmanApp.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest } from '../../FetchProvider';

type APIChapter = {
    code: number,
    data: {
        id: string,
        title: string
    }[]
}

@Common.PagesSinglePageCSS('img.man_img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manmanapp', `Manman Comic 漫漫漫画`, 'https://www.manmanapp.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https?:\/\/www\.manmanapp\.com\/comic[^/]+\.html$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.match(/(\d+).html/)[1];
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLLIElement>(request, 'li.title');
        const title = data[0].childNodes[0].nodeValue.trim();
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    async getMangasFromPage(page: number, provider: MangaPlugin) {
        const uri = new URL(`/comic/category_${page}.html`, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'li.title > a');
        return data.map(manga => {
            const id = manga.pathname.match(/(\d+).html/)[1];
            return new Manga(this, provider, id, manga.text.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        //The Ajax call doesnt work with page 1, so we have to fetch page 1 manually
        const url = new URL(`/comic-${manga.Identifier}.html`, this.URI);
        const request = new FetchRequest(url.href);
        const data = await FetchCSS<HTMLLIElement>(request, 'ul.comic_list li');
        for (const liElement of data) {
            const title = liElement.querySelector<HTMLHeadingElement>('h3').textContent.trim();
            const id = liElement.querySelector<HTMLAnchorElement>('a').pathname;
            chapterslist.push(new Chapter(this, manga, id, title));
        }

        for (let page = 2, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;
    }

    async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(new URL('/works/comic-list-ajax.html', this.URI).href, {
            method: 'POST',
            body: new URLSearchParams({ id: manga.Identifier, sort: '0', page: String(page) }).toString(),
            headers: {
                'X-Requested-With' : 'XMLHttpRequest',
            }
        });
        const datt = await FetchJSON<APIChapter>(request);
        return datt.code == 1 ? datt.data.map(element => new Chapter(this, manga, `/comic/detail-${element.id}.html`, element.title.trim())) : [];
    }
}
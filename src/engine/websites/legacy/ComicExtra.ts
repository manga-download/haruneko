// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicExtra.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicextra', `ComicExtra`, 'https://www.comicextra.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicExtra extends Connector {

    constructor() {
        super();
        super.id = 'comicextra';
        super.label = 'ComicExtra';
        this.tags = ['comic', 'english'];
        this.url = 'https://www.comicextra.com';
        this.path = '/comic-list/';
    }

    async _getMangas() {
        let mangaList = [];
        const uri = new URL(this.path + 'others', this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, '.general-nav a');
        const pages = data.map(element => {
            return this.getRootRelativeOrAbsoluteLink(element, request.url);
        });

        for(let page of pages) {
            const mangas = await this._getMangasFromPage(page);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        const uri = new URL(page, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, '.home-list .hl-box .hlb-t a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.textContent.trim()
            };
        });
    }

    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, '.title-1');
        const id = uri.pathname;
        const title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getChapters(manga) {
        let chapList = [];
        for(let page = 1, run = true; run; page++) {
            let chapters = await this._getChaptersFromPage(manga, page);
            chapList.push(...chapters);
            run = chapters.continue;
        }
        return chapList;
    }

    async _getChaptersFromPage(manga, page) {
        const uri = new URL(manga.id + `/${page}/`, this.url);
        const request = new Request(uri, this.requestOptions);
        const body = (await this.fetchDOM(request, 'body'))[0];
        const nextLink = body.querySelector('div.episode-list div.general-nav a:last-of-type');
        const hasNextLink = nextLink ? nextLink.text == "Next" : false;
        const data = [...body.querySelectorAll('#list tr td a')];
        const chapters = data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.textContent.trim()
            };
        });
        chapters['continue'] = hasNextLink;
        return chapters;
    }

    async _getPages(chapter) {
        const request = new Request(this.url + chapter.id + '/full', this.requestOptions);
        const data = await this.fetchDOM(request, '.chapter_img');
        return data.map(element => this.getAbsolutePath(element, request.url));
    }
}
*/
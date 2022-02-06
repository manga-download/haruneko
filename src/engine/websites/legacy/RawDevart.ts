// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RawDevart.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawdevart', `Rawdevart`, 'https://rawdevart.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RawDevart extends Connector {

    constructor() {
        super();
        super.id = 'rawdevart';
        super.label = 'Rawdevart';
        this.tags = [ 'manga', 'raw', 'japanese' ];
        this.url = 'https://rawdevart.com';
        this.links = {
            login: 'https://rawdevart.com/login/'
        };
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.manga-top-info h1.title');
        let id = uri.pathname;
        let title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        let request = new Request(this.url, this.requestOptions);
        let data = await this.fetchDOM(request, 'ul.pagination li:last-of-type a.page-link');
        let pageCount = parseInt(data[0].href.match(/page=(\d+)/)[1]);
        for(let page = 1; page <= pageCount; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let request = new Request(this.url + '/?page=' + page, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.card-body div.card div.overlay a.head');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        // https://rawdevart.com/api/chapters.json?comic=666&ordering=volume%2Cnum%2Csnum&n=1000
        let chapterList = [];
        let request = new Request(new URL(manga.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'ul.pagination li:last-of-type a.page-link');
        let pageCount = data.length === 0 ? 1 : parseInt(data[0].href.match(/page=(\d+)/)[1]);
        for(let page = 1; page <= pageCount; page++) {
            let chapters = await this._getChaptersFromPage(manga, page);
            chapterList.push(...chapters);
        }
        return chapterList;
    }

    async _getChaptersFromPage(manga, page) {
        let request = new Request(new URL(`${manga.id}?page=${page}`, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.manga-body-right div.card-body div.list-group-item a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.title.trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let request = new Request(this.url + chapter.id, this.requestOptions);
        let data = await this.fetchDOM(request, 'div#img-container source');
        return data.map(element => this.getAbsolutePath(element.dataset.src, request.url));
    }
}
*/
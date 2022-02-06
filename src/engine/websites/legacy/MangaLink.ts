// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaLink.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalink', `MangaLink`, 'https://www.mangalink.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLink extends Connector {

    constructor() {
        super();
        super.id = 'mangalink';
        super.label = 'MangaLink';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://www.mangalink.cc';
    }

    async _getMangas() {
        let mangaList = [];
        let request = new Request(new URL('/mangas', this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'li:last-of-type > a');
        let pageCount = parseInt(data[0].href.match(/(\d*)$/)[1]);
        for(let page = 1; page <= pageCount; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let request = new Request(new URL(`/mangas?page=${page}`, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.d-flex > div > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim()
            };
        });
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'h1.card-header');
        let id = uri.pathname + uri.search;
        let title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.my-4 a.btn');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim()
            };
        });
    }

    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, '#images source');
        return data.map(element => this.getAbsolutePath(element.dataset.src, this.url));
    }

}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './EarlyManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('earlymanga', `EarlyManga`, 'https://earlymanga.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EarlyManga extends Connector {

    constructor() {
        super();
        super.id = 'earlymanga';
        super.label = 'EarlyManga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://earlymanga.org';
    }

    async _getMangaFromURI(uri) {
        const request = new Request(new URL(uri), this.requestOptions);
        const data = await this.fetchDOM(request, 'head title');
        const id = uri.pathname;
        const title = data[0].text.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        const uri = new URL(`/lazymore/manga-${ 40 * page }`, this.url);
        const request = new Request(uri, this.requestOptions);
        let data = await this.fetchJSON(request);
        if(typeof data === 'string') {
            data = JSON.parse(data);
        }
        return !Array.isArray(data) ? [] : data.map(item => {
            return {
                id: '/manga/' + item.manga_slug.trim(),
                title: item.manga_title.trim()
            };
        });
    }

    async _getChapters(manga) {
        const uri = new URL(manga.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'div:not(.d-none) > div.chapter-row > div.order-lg-2 > a:not([style])');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.querySelector('div:not([style])').textContent.trim()
            };
        });
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'div.chapter-images-container-up source:not(.d-none)');
        return data.map(image => this.getAbsolutePath(image, request.url));
    }
}
*/
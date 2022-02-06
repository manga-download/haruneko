// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HentaiMimi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaimimi', `HentaiMimi`, 'https://hentaimimi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HentaiMimi extends Connector {

    constructor() {
        super();
        super.id = 'hentaimimi';
        super.label = 'HentaiMimi';
        this.tags = [ 'manga', 'hentai', 'english' ];
        this.url = 'https://hentaimimi.com';
    }

    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'meta[name="title"]');
        return new Manga(this, uri.pathname, data[0].content.trim());
    }

    async _getMangas() {
        let mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        const uri = new URL('/index?page=' + page, this.url);
        const request = new Request(uri, this.requestOptions);
        const body = (await this.fetchDOM(request, 'body'))[0];
        const last = body.querySelector('ul.pagination li.page-item:last-of-type a[data-page]').dataset.page;
        return page > 999 || page > last ? [] : [...body.querySelectorAll('div.row div.mb-44 div.card-body h5 a')].map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        return [ { ...manga, language: '' } ];
    }

    async _getPages(chapter) {
        const script = `
            new Promise(resolve => {
                resolve(previewImages.map(image => new URL(image, window.location.origin).href));
            });
        `;
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        return Engine.Request.fetchUI(request, script);
    }
}
*/
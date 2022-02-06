// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicBoost.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicboost', `comicブースト (Comic Boost)`, 'https://comic-boost.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicBoost extends Publus {

    constructor() {
        super();
        super.id = 'comicboost';
        super.label = 'comicブースト (Comic Boost)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-boost.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'article#book div.detail h1.name');
        let id = uri.pathname + uri.search;
        let title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let request = new Request(new URL('/series?per=1000', this.url), this.requestOptions );
        let data = await this.fetchDOM(request, 'div.box ul li div.info p.name a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions );
        let data = await this.fetchDOM(request, 'section#productList ul.list_item--series li div.product_item ul.box_button li a.button');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.closest('div.product_item').querySelector('p.name').textContent.trim(),
                language: ''
            };
        });
    }
}
*/
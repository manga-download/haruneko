// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaIndoWeb.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaindoweb', `MangaIndoWeb`, 'https://mangaindo.web.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaIndoWeb extends Connector {

    constructor() {
        super();
        super.id = 'mangaindoweb';
        super.label = 'MangaIndoWeb';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangaindo.web.id';
        this.path = '/manga-list/';

        this.queryMangas = 'div#az-slider div.letter-section ul li.manga-list a';
        this.queryChapters = 'ul.lcp_catlist li a';
        this.queryPages = 'div.entry-content source[src]:not([src=""])';
        this.querMangaTitleFromURI = 'div#main article div.title h2';
    }

    async _getMangas() {
        const uri = new URL(this.path, this.url);
        const request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryMangas);

        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink( element, this.url ),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        const uri = new URL(manga.id, this.url);
        const request = new Request( uri, this.requestOptions );
        let data = await this.fetchDOM(request, this.queryChapters);

        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.replace( manga.title, '' ).replace( '–', '' ).trim()
            };
        });
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryPages);

        return data.map(element => this.getAbsolutePath( element, request.url ));
    }

    async _getMangaFromURI(uri) {
        const request = new Request(new URL(uri), this.requestOptions);
        const data = await this.fetchDOM(request, this.querMangaTitleFromURI);
        const title = data[0].textContent.trim();

        return new Manga(this, uri, title);
    }

}
*/
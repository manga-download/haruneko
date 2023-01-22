// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MundoMangaKun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mundomangakun', `Mundo Mangá-Kun`, 'https://mundomangakun.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MundoMangaKun extends Connector {

    constructor() {
        super();
        super.id = 'mundomangakun';
        super.label = 'Mundo Mangá-Kun';
        this.tags = [ 'manga', 'portuguese'];
        this.url = 'https://mundomangakun.com.br';
    }

    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'h1.titulo_projeto');
        const id = uri.pathname + uri.search;
        const title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        let request = new Request(new URL('/leitor-online/', this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.paginacao > a:nth-last-child(2)');
        let pageCount = parseInt(data[0].href.match(/(\d+)\/$/)[1]);
        for(let page = 1; page <= pageCount; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let request = new Request(new URL(`/leitor-online/page/${page}/`, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'h2 > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        const request = new Request(new URL(manga.id, this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'div.capitulos_leitor_online > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element.getAttribute('onclick').match(/'link':'([^']*)'/)[1].replace(/\\\//g, '/'), request.url),
                title: element.textContent.trim()
            };
        });
    }

    async _getPages(chapter) {
        const request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        const data = await this.fetchRegex(request, /paginas\s*=\s*(\[[^\]]*\]);/g);
        return JSON.parse(data);
    }
}
*/
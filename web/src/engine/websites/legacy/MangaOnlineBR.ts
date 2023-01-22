// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaOnlineBR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaonlinebr', `MangaOnlineBR`, 'http://mangaonline.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaOnlineBR extends Connector {

    constructor() {
        super();
        super.id = 'mangaonlinebr';
        super.label = 'MangaOnlineBR';
        this.tags = ['manga', 'portuguese'];
        this.url = 'http://mangaonline.com.br';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div#pagina div.manga-button span.text h1');
        let id = uri.pathname + uri.search;
        let title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let request = new Request(new URL('/titulos/', this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div#lista-mangas div.manga > p:first-of-type > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div#volumes-capitulos span.capitulo a');
        return data.map(element => {
            this.cfMailDecrypt(element);
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let match = chapter.id.match(/\/([^/]+)\/capitulo\/(\d+)\/?$/);
        let uri = new URL( `/capitulo.php?act=getImg&anime=${match[1]}&capitulo=${match[2]}&src=1&view=2`, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div#imgAvancadoVisualizacao source');
        return data.map(element => this.getAbsolutePath(element, request.url));
    }
}
*/
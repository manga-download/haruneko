// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

// TODO Need novel support

//import { Tags } from '../../Tags';
import icon from './EpikManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('epikmanga', `Epik Manga`, 'https://www.epiknovel.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EpikManga extends FlatManga {

    constructor() {
        super();
        super.id = 'epikmanga';
        super.label = 'Epik Manga';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://www.epikmanga.com';
        this.path = '/seri-listesi?ltype=text&type=text';

        this.queryMangaTitle = 'head title';
        this.queryMangas = 'div#pop-href div[id^=char-] a';
    }

    async _getMangaFromURI(uri) {
        const manga = await super._getMangaFromURI(uri);
        manga.title = manga.title.split(' | ').shift().trim();
        return manga;
    }

    async _getChapters(manga) {
        let request = new Request(this.url + manga.id, this.requestOptions);
        let data = await this.fetchDOM(request, 'table.table tbody tr td:first-of-type a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim(),
                language: ''
            };
        });
    }
}
*/
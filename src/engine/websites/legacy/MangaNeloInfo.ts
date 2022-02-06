// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaNeloInfo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganeloinfo', `MangaNeloInfo`, 'http://manganelo.info' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNeloInfo extends MangaNel {

    constructor() {
        super();
        super.id = 'manganeloinfo';
        super.label = 'MangaNeloInfo';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'http://manganelo.info';

        this.path = '/?page=';
        this.queryMangaTitle = 'div.manga-info-top ul.manga-info-text li h1';
        this.queryMangasPageCount = 'div.pagination ul.pagination li:nth-last-of-type(2) a';
        this.queryMangas = 'div.doreamon div.first ul li h3 a';
        // NOTE: a corresponding entry for chapter/page queries must be defined in the base class (required for cross-domain-support)
    }

    // Exactly same "protection" as in AnyACG template
    async _getPages(chapter) {
        let uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div#vungdoc p#arraydata');
        return data[0].textContent.split(',').map(link => this.getAbsolutePath(link.trim(), request.url));
    }

    canHandleURI(uri) {
        // Test: https://regex101.com/r/aPR3zy/3/tests
        return /^(m\.|chap\.)?manganelo\.info$/.test(uri.hostname);
    }
}
*/
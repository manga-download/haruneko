// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikuCOM.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikucom', `Komiku.COM`, 'https://komiku.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikuCOM extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikucom';
        super.label = 'Komiku.COM';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://komiku.com';
        this.path = '/manga/list-mode/';
    }

    async _getMangaFromURI(uri) {
        const request = new Request(new URL(uri), this.requestOptions);
        const data = await this.fetchDOM(request, this.querMangaTitleFromURI);
        return new Manga(this, uri.pathname, data[0].textContent.trim().replace(/^Komik\s*i, ''));
    }
}
*/
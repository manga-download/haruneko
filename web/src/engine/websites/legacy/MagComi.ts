// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MagComi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('magcomi', `MAGCOMI`, 'https://magcomi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MagComi extends CoreView {

    constructor() {
        super();
        super.id = 'magcomi';
        super.label = 'MAGCOMI';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://magcomi.com';

        this.path = [ '/series' ];
        this.queryManga = 'ul.magcomi-series-list > li.series-item > a';
        this.queryMangaTitle = 'h3.series-title';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'head title');
        let id = uri.pathname;
        let title = data[0].text.split('|')[0].trim();
        return new Manga(this, id, title);
    }
}
*/
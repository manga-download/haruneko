// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BatoScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('batoscan', `BatoScan`, 'https://batoscan.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BatoScan extends FlatManga {

    constructor() {
        super();
        super.id = 'batoscan';
        super.label = 'BatoScan';
        this.tags = [ 'manga', 'raw', 'japanese' ];
        this.url = 'https://batoscan.net';
        this.requestOptions.headers.set('x-referer', this.url + '/read-');

        this.queryChapters = 'div#tab-chapper div#list-chapters span.title a.chapter';
    }
}
*/
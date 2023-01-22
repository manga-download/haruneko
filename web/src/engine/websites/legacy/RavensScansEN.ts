// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RavensScansEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ravensscans-en', `RavensScans (English)`, 'https://ravens-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RavensScansEN extends ReaderFront {

    constructor() {
        super();
        super.id = 'ravensscans-en';
        super.label = 'RavensScans (English)';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://ravens-scans.com';
        this.cdn = 'https://img-cdn1.ravens-scans.com';
        this.apiURL = 'https://api.ravens-scans.com';
        this.language = 'en';
    }

    canHandleURI(uri) {
        return uri.origin === this.url && uri.pathname.includes('/en/');
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RavensScansES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ravensscans-es', `RavensScans (Spanish)`, 'https://ravens-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RavensScansES extends ReaderFront {

    constructor() {
        super();
        super.id = 'ravensscans-es';
        super.label = 'RavensScans (Spanish)';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://ravens-scans.com';
        this.cdn = 'https://img-cdn1.ravens-scans.com';
        this.apiURL = 'https://api.ravens-scans.com';
        this.language = 'es';
    }

    canHandleURI(uri) {
        return uri.origin === this.url && uri.pathname.includes('/es/');
    }
}
*/
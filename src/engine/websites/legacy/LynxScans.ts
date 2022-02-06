// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LynxScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('secretscans', `Lynx Scans`, 'https://lynxscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LynxScans extends Genkan {

    constructor() {
        super();
        super.id = 'secretscans';
        super.label = 'Lynx Scans';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://lynxscans.com';
        this.links = {
            login: 'https://lynxscans.com/login'
        };
        this.path = '/web/comics';
    }
}
*/
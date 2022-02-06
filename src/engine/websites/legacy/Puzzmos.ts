// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Puzzmos.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('puzzmos', `Puzzmos`, 'https://puzzmos.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Puzzmos extends MangaReaderCMS {
    constructor() {
        super();
        super.id = 'puzzmos';
        super.label = 'Puzzmos';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'https://puzzmos.com';
        this.links = {
            login: 'https://puzzmos.com/auth/login'
        };
        this.language = 'tr';
    }
}
*/
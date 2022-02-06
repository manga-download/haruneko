// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineMangaNet.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninemanganet', `Ninemanga.net`, 'https://ninemanga.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineMangaNet extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'ninemanganet';
        super.label = 'Ninemanga.net';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://ninemanga.net';
        this.links = {
            login: 'https://ninemanga.net/auth/login'
        };

        this.language = 'es';
    }
}
*/
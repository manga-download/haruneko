// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GeassHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('geasshentai', `Geass Hentai`, 'https://geassscan.xyz/' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GeassHentai extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'geasshentai';
        super.label = 'Geass Hentai';
        this.tags = [ 'webtoon', 'hentai', 'portuguese' ];
        this.url = 'https://geassscan.xyz/';
        this.path = '/manga/list-mode/';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ExHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('exhentai', `ExHentai`, 'https://exhentai.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ExHentai extends EHentai {

    constructor() {
        super();
        super.id = 'exhentai';
        super.label = 'ExHentai';
        this.tags = ['hentai', 'multi-lingual'];
        this.url = 'https://exhentai.org';
        this.requestOptions.headers.set('x-cookie', 'nw=1; yay=EXPIRED');
    }
}
*/
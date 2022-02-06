// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FunManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('funmanga', `FunManga`, 'http://www.funmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FunManga extends MangaInn {
    constructor() {
        super();
        super.id = 'funmanga';
        super.label = 'FunManga';
        this.tags = ['manga', 'english'];
        this.url = 'http://www.funmanga.com';
    }
}
*/
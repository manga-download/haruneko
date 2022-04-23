// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './UnnieGL.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('unniegl', `UnnieGL`, 'https://www.unniegl.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class UnnieGL extends TuMangaOnline {

    constructor() {
        super();
        super.id = 'unniegl';
        super.label = 'UnnieGL';
        this.tags = [ 'manga', 'spanish' ];
        this.url = 'https://www.unniegl.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSushi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasushi', `Mangasushi`, 'https://mangasushi.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSushi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasushi';
        super.label = 'Mangasushi';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://mangasushi.net';
    }
}
*/
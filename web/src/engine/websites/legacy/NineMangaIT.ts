// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineMangaIT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninemanga-it', `NineMangaIT`, 'https://it.ninemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineMangaIT extends NineManga {

    constructor() {
        super();
        super.id = 'ninemanga-it';
        super.label = 'NineMangaIT';
        this.tags = [ 'manga', 'italian' ];
        this.url = 'https://it.ninemanga.com';
    }
}
*/
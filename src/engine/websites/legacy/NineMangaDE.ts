// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineMangaDE.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninemanga-de', `NineMangaDE`, 'https://de.ninemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineMangaDE extends NineManga {

    constructor() {
        super();
        super.id = 'ninemanga-de';
        super.label = 'NineMangaDE';
        this.tags = [ 'manga', 'german' ];
        this.url = 'https://de.ninemanga.com';
    }
}
*/
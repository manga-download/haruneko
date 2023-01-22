// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineMangaRU.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninemanga-ru', `NineMangaRU`, 'https://ru.ninemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineMangaRU extends NineManga {

    constructor() {
        super();
        super.id = 'ninemanga-ru';
        super.label = 'NineMangaRU';
        this.tags = [ 'manga', 'russian' ];
        this.url = 'https://ru.ninemanga.com';
    }
}
*/
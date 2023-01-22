// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineMangaBR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninemanga-br', `NineMangaBR`, 'https://br.ninemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineMangaBR extends NineManga {

    constructor() {
        super();
        super.id = 'ninemanga-br';
        super.label = 'NineMangaBR';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://br.ninemanga.com';
    }
}
*/
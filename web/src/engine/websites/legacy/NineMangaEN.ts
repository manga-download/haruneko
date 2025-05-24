// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineMangaEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninemanga-en', `NineMangaEN`, 'https://ninemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineMangaEN extends NineManga {

    constructor() {
        super();
        super.id = 'ninemanga-en';
        super.label = 'NineMangaEN';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://en.ninemanga.com';
    }
}
*/
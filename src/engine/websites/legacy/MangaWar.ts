// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaWar.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangawar', `Manga War`, 'https://mangawar.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWar extends WordPressMadara {
    constructor() {
        super();
        super.id = 'mangawar';
        super.label = 'Manga War';
        this.tags = [ 'manga', 'high-quality', 'english' ];
        this.url = 'https://mangawar.com';
        this.language = 'en';
    }
}
*/
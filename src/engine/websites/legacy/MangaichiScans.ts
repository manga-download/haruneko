// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaichiScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaichiscans', `MangaichiScans`, 'http://mangaichiscans.mokkori.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaichiScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangaichiscans';
        super.label = 'MangaichiScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://mangaichiscans.mokkori.fr';
        this.path = '/fs/directory/';
        this.language = 'english';
    }
}
*/
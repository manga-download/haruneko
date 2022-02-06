// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './XAnimeSeduccion.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xanimeseduccion', `XAnimeSeduccion`, 'http://xanime-seduccion.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class XAnimeSeduccion extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'xanimeseduccion';
        super.label = 'XAnimeSeduccion';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://xanime-seduccion.com';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/
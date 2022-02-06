// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Lilyreader.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lilyreader', `Lilyreader`, 'https://manga.smuglo.li' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Lilyreader extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'lilyreader';
        super.label = 'Lilyreader';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://manga.smuglo.li';
        this.path = '/directory/';
        this.language = 'english';
    }
}
*/
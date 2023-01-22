// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TsubasaSociety.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tsubasasociety', `Tsubasa Society`, 'https://www.tsubasasociety.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TsubasaSociety extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'tsubasasociety';
        super.label = 'Tsubasa Society';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://www.tsubasasociety.com';
        this.path = '/reader/master/Xreader/directory/';
        this.language = 'english';
    }
}
*/
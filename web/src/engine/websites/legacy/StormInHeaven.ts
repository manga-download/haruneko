// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './StormInHeaven.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('storminheaven', `Storm in Heaven`, 'https://www.storm-in-heaven.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class StormInHeaven extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'storminheaven';
        super.label = 'Storm in Heaven';
        this.tags = [ 'manga', 'high-quality', 'italian', 'scanlation' ];
        this.url = 'https://www.storm-in-heaven.net';
        this.path = '/reader-sih/directory/';
        this.language = 'italian';
    }
}
*/
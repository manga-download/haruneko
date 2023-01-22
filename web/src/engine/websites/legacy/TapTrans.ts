// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TapTrans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('taptrans', `TapTrans`, 'https://taptaptaptaptap.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TapTrans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'taptrans';
        super.label = 'TapTrans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://taptaptaptaptap.net';
        this.path = '/fs/directory/';
        this.language = 'english';
    }
}
*/
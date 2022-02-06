// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YuriISM.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yuriism', `YuriISM`, 'https://www.yuri-ism.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YuriISM extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'yuriism';
        super.label = 'YuriISM';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://www.yuri-ism.net';
        this.path = '/slide/directory/';
        this.language = 'english';
    }
}
*/
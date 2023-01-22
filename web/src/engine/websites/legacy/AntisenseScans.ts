// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AntisenseScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('antisensescans', `AntisenseScans`, 'http://antisensescans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AntisenseScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'antisensescans';
        super.label = 'AntisenseScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://antisensescans.com';
        this.path = '/online/directory/';
        this.language = 'english';
    }
}
*/
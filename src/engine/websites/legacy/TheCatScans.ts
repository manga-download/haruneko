// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TheCatScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thecatscans', `TheCatScans`, 'https://reader2.thecatscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TheCatScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'thecatscans';
        super.label = 'TheCatScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://reader2.thecatscans.com';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/
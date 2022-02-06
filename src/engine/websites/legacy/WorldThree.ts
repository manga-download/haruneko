// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WorldThree.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('worldthree', `WorldThree`, 'http://www.slide.world-three.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WorldThree extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'worldthree';
        super.label = 'WorldThree';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://www.slide.world-three.org';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/
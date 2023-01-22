// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Riceballicious.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('riceballicious', `Riceballicious`, 'http://riceballicious.info' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Riceballicious extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'riceballicious';
        super.label = 'Riceballicious';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://riceballicious.info';
        this.path = '/fs/reader/list/';
        this.language = 'english';
    }
}
*/
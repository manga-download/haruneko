// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mangatellers.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatellers', `Mangatellers`, 'http://www.mangatellers.gr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangatellers extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangatellers';
        super.label = 'Mangatellers';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://www.mangatellers.gr';
        this.path = '/reader/reader/list/';
        this.language = 'english';
    }
}
*/
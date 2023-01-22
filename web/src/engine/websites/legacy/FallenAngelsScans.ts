// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FallenAngelsScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fallenangelsscans', `FallenAngelsScans`, 'https://manga.fascans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FallenAngelsScans extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'fallenangelsscans';
        super.label = 'FallenAngelsScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://manga.fascans.com';

        this.language = 'en';
    }
}
*/
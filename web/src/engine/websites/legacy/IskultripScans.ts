// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './IskultripScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('iskultripscans', `Iskultrip Scans`, 'http://www.maryfaye.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IskultripScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'iskultripscans';
        super.label = 'Iskultrip Scans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://www.maryfaye.net';
        this.path = '/reader/directory/';
        this.language = 'english';
    }
}
*/
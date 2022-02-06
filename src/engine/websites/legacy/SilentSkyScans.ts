// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SilentSkyScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('silentskyscans', `SilentSkyScans`, 'http://reader.silentsky-scans.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SilentSkyScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'silentskyscans';
        super.label = 'SilentSkyScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://reader.silentsky-scans.net';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/
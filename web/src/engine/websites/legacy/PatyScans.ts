// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PatyScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('patyscans', `PatyScans`, 'http://lector.patyscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PatyScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'patyscans';
        super.label = 'PatyScans';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://lector.patyscans.com';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PCNet.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pcnet', `PCNet`, 'http://pcnet.patyscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PCNet extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'pcnet';
        super.label = 'PCNet';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://pcnet.patyscans.com';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }
}
*/
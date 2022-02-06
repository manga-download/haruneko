// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DokiFansubs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dokifansubs', `DokiFansubs`, 'https://kobato.hologfx.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DokiFansubs extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'dokifansubs';
        super.label = 'DokiFansubs';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://kobato.hologfx.com';
        this.path = '/reader/directory/';
        this.language = 'english';
    }
}
*/
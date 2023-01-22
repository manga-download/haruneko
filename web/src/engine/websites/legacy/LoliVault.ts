// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LoliVault.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lolivault', `LoliVault`, 'https://lolivault.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LoliVault extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'lolivault';
        super.label = 'LoliVault';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://lolivault.net';
        this.path = '/online/directory/';
        this.language = 'spanish';
    }
}
*/
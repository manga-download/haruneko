// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangarawOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarawonline', `Mangaraw Online`, 'http://mangaraw.online' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangarawOnline extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangarawonline';
        super.label = 'Mangaraw Online';
        this.tags = [ 'manga', 'high-quality', 'raw' ];
        this.url = 'http://mangaraw.online';
    }
}
*/
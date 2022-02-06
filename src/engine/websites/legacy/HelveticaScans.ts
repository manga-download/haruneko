// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HelveticaScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('helveticascans', `HelveticaScans`, 'https://helveticascans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HelveticaScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'helveticascans';
        super.label = 'HelveticaScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://helveticascans.com';
        this.path = '/r/directory/';
        this.language = 'english';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Komikid.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikid', `Komikid`, 'https://www.komikid.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Komikid extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'komikid';
        super.label = 'Komikid';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.komikid.com';

        this.language = 'id';
    }
}
*/
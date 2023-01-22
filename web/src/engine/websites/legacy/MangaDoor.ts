// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaDoor.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadoor', `MangaDoor`, 'http://mangadoor.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaDoor extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangadoor';
        super.label = 'MangaDoor';
        this.tags = [ 'manga', 'spanish' ];
        this.url = 'http://mangadoor.com';

        this.language = 'es';
    }
}
*/
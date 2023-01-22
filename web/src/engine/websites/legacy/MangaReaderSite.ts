// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaReaderSite.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangareadersite', `MangaReaderSite`, 'https://mangareader.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaReaderSite extends MangaHub {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangareadersite';
        super.label = 'MangaReaderSite';
        this.url = 'https://mangareader.site';

        this.path = 'mr01';
    }
}
*/
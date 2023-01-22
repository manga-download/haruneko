// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikmanga', `KomikManga`, 'https://komikmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikManga extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'komikmanga';
        super.label = 'KomikManga';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikmanga.com';

        this.language = 'in';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikGue.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikgue', `KomikGue`, 'https://www.komikgue.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikGue extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'komikgue';
        super.label = 'KomikGue';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.komikgue.com';

        this.queryChapters = 'div.chapter-wrapper table td.chapter a';
        this.language = 'id';
    }
}
*/
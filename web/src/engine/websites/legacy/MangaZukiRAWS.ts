// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaZukiRAWS.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazuki-raws', `Mangazuki RAWS`, 'https://raws.mangazuki.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaZukiRAWS extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangazuki-raws';
        super.label = 'Mangazuki RAWS';
        this.tags = [ 'manga', 'high-quality', 'korean', 'scanlation' ];
        this.url = 'https://raws.mangazuki.co';

        this.queryMangas = 'ul.price-list li a';
        this.queryChapters = 'ul.chapters li h3.chapter-title-rtl a';
        this.language = 'kr';
    }
}
*/
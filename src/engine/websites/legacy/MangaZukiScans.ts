// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaZukiScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazuki-scans', `Mangazuki Scans`, 'https://mangazuki.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaZukiScans extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangazuki-scans';
        super.label = 'Mangazuki Scans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://mangazuki.co';

        this.queryMangas = 'ul.price-list li a';
        this.queryChapters = 'ul.chapters li h3.chapter-title-rtl a';
        this.language = 'en';
    }
}
*/
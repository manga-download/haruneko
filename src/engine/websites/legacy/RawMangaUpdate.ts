// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RawMangaUpdate.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawmangaupdate', `RawMangaUpdate`, 'http://rawmangaupdate.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RawMangaUpdate extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'rawmangaupdate';
        super.label = 'RawMangaUpdate';
        this.tags = [ 'manga', 'high-quality', 'chinese', 'scanlation' ];
        this.url = 'http://rawmangaupdate.com';

        this.queryChapters = 'ul.chapters li h5.chapter-title-rtl a';
        this.language = 'zh';
    }
}
*/
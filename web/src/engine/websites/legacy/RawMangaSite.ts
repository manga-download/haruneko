// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RawMangaSite.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawmangasite', `RawMangaSite`, 'https://rawmanga.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RawMangaSite extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'rawmangasite';
        super.label = 'RawMangaSite';
        this.tags = [ 'manga', 'high-quality', 'raw' ];
        this.url = 'https://rawmanga.site';
    }
}
*/
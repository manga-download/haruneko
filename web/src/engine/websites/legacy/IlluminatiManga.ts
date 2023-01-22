// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './IlluminatiManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('illuminatimanga', `IlluminatiManga`, 'http://reader.manga-download.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IlluminatiManga extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'illuminatimanga';
        super.label = 'IlluminatiManga';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://reader.manga-download.org';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/
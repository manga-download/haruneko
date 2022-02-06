// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaVadisi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangavadisi', `MangaVadisi`, 'http://manga-v2.mangavadisi.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaVadisi extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangavadisi';
        super.label = 'MangaVadisi';
        this.tags = [ 'manga', 'high-quality', 'turkish', 'scanlation' ];
        this.url = 'http://manga-v2.mangavadisi.org';
    }
}
*/
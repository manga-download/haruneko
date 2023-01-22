// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ScanFR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanfr', `Scan FR`, 'https://www.scan-fr.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScanFR extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'scanfr';
        super.label = 'Scan FR';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://www.scan-fr.cc';

        this.queryChapters = 'ul.chapterszozo li a';
        this.language = 'fr';
    }
}
*/
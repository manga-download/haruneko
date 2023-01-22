// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KirishimaFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kirishimafansub', `KirishimaFansub`, 'https://www.kirishimafansub.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KirishimaFansub extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'kirishimafansub';
        super.label = 'KirishimaFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://www.kirishimafansub.net';
        this.path = '/reader/';
        this.language = 'spanish';
    }
}
*/
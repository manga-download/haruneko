// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AkaiYuhiMun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('akaiyuhimun', `AkaiYuhiMun Team`, 'https://akaiyuhimun.ru' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AkaiYuhiMun extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'akaiyuhimun';
        super.label = 'AkaiYuhiMun Team';
        this.tags = [ 'manga', 'high-quality', 'russian', 'scanlation' ];
        this.url = 'https://akaiyuhimun.ru';
        this.path = '/manga/directory/';
        this.language = 'russian';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Russification.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('russification', `Русификация (Russification)`, 'https://rusmanga.ru' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Russification extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'russification';
        super.label = 'Русификация (Russification)';
        this.tags = [ 'manga', 'high-quality', 'russian', 'scanlation' ];
        this.url = 'https://rusmanga.ru';
        this.path = '/directory/';
        this.language = 'russian';
    }
}
*/
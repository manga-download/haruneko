// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './UniversoYuri.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('universoyuri', `Universo Yuri`, 'http://www.universoyuri.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class UniversoYuri extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'universoyuri';
        super.label = 'Universo Yuri';
        this.tags = [ 'manga', 'spanish' ];
        this.url = 'http://www.universoyuri.com';
    }
}
*/
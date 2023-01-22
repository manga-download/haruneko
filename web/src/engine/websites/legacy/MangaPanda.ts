// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaPanda.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapanda', `MangaPanda`, 'https://www.mangapanda.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaPanda extends MangaReader {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangapanda';
        super.label = 'MangaPanda';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://www.mangapanda.com';
    }
}
*/
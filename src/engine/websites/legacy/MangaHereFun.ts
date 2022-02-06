// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaHereFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaherefun', `MangaHereFun`, 'https://mangahere.onl' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaHereFun extends MangaHub {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangaherefun';
        super.label = 'MangaHereFun';
        this.url = 'https://mangahere.onl';

        this.path = 'mh01';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaKakalotFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakakalotfun', `MangaKakalotFun`, 'https://mangakakalot.fun' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKakalotFun extends MangaHub {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangakakalotfun';
        super.label = 'MangaKakalotFun';
        this.url = 'https://mangakakalot.fun';

        this.path = 'mn01';
    }
}
*/
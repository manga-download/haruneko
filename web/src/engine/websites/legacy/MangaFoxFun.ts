// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaFoxFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangafoxfun', `MangaFoxFun`, 'https://mangafox.fun' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaFoxFun extends MangaHub {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangafoxfun';
        super.label = 'MangaFoxFun';
        this.url = 'https://mangafox.fun';

        this.path = 'mf01';
    }
}
*/
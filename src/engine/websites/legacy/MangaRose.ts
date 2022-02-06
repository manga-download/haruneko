// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaRose.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarose', `MangaRose`, 'https://mangarose.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRose extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangarose';
        super.label = 'MangaRose';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangarose.com';
    }
}
*/
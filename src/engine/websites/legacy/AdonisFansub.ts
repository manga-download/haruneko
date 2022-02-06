// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AdonisFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yayutoon', `YAYUTOON`, 'https://yayutoon.fun' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AdonisFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yayutoon';
        super.label = 'YAYUTOON';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://yayutoon.fun';

        this.language = 'tr';
    }
}
*/
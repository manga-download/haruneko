// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KissmangaIN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kissmangain', `Kissmanga`, 'https://kissmanga.in' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KissmangaIN extends WordPressMadara {

    constructor() {
        super();
        super.id = 'kissmangain';
        super.label = 'Kissmanga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://kissmanga.in';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaGreat.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagreat', `MANGAGREAT`, 'https://mangagreat.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGreat extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangagreat';
        super.label = 'MANGAGREAT';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangagreat.com';

        this.queryPages = 'div.read-container source';
    }
}
*/
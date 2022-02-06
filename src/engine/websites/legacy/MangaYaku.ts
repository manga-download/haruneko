// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaYaku.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangayaku', `MangaYaku`, 'https://mangayaku.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaYaku extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangayaku';
        super.label = 'MangaYaku';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://mangayaku.my.id';
    }
}
*/
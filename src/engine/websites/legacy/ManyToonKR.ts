// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManyToonKR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manytoonkr', `ManyToonKR`, 'https://manytoon.club' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManyToonKR extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manytoonkr';
        super.label = 'ManyToonKR';
        this.tags = [ 'webtoon', 'hentai', 'raw', 'korean' ];
        this.url = 'https://manytoon.club';
    }
}
*/
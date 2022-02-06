// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BakaMan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bakaman', `BAKAMAN`, 'https://bakaman.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BakaMan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bakaman';
        super.label = 'BAKAMAN';
        this.tags = [ 'manga', 'webtoon', 'thai' ];
        this.url = 'https://bakaman.net';
    }
}
*/
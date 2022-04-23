// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShimadaScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shimadascans', `Shimadascans`, 'https://shimadascans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShimadaScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'shimadascans';
        super.label = 'Shimadascans';
        this.tags = [ 'webtoon', 'english', 'scanlation' ];
        this.url = 'https://shimadascans.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WebtoonXYZ.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoonxyz', `WebtoonXYZ`, 'https://www.webtoon.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebtoonXYZ extends WordPressMadara {

    constructor() {
        super();
        super.id = 'webtoonxyz';
        super.label = 'WebtoonXYZ';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.webtoon.xyz';

        // NOTE : in case they fix the structure
        this.queryMangas = 'div.post-title h3 a, div.post-title h5 a, div.post-title .h5 a';
    }
}
*/
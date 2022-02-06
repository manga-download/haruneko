// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BestManhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bestmanhua', `Best Manhua`, 'https://bestmanhua.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BestManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bestmanhua';
        super.label = 'Best Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://bestmanhua.com';

        this.queryPages = 'ul.blocks-gallery-grid li.blocks-gallery-item figure source';
    }
}
*/
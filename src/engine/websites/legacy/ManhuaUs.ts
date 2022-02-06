// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhuaUs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaus', `Manhua Us`, 'https://manhuaus.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaUs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuaus';
        super.label = 'Manhua Us';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuaus.com';

        this.queryPages = 'div.page-break source, ul.blocks-gallery-grid li.blocks-gallery-item source';
    }
}
*/
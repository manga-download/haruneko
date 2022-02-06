// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhuaPlus.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaplus', `ManhuaPlus`, 'https://manhuaplus.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaPlus extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuaplus';
        super.label = 'ManhuaPlus';
        this.tags = [ 'webtoon', 'vietnamese' ];
        this.url = 'https://manhuaplus.com';

        this.queryPages = 'figure source, div.page-break source, div.chapter-video-frame source, div.reading-content p source';
    }
}
*/
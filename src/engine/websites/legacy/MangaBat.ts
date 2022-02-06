// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaBat.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabat', `MangaBat`, 'https://m.mangabat.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaBat extends MangaNel {

    constructor() {
        super();
        super.id = 'mangabat';
        super.label = 'MangaBat';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://m.mangabat.com';

        this.path = '/manga-list-all/';
        this.queryMangas = 'div.panel-list-story div.list-story-item h3 a.item-title';
        // NOTE: a corresponding entry for chapter/page queries must be defined in the base class (required for cross-domain-support)
    }

    canHandleURI(uri) {
        // Test: https://regex101.com/r/GlzAw2/2/tests
        return /^(m\.|read\.)?mangabat\.com$/.test(uri.hostname);
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mangaboss.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaboss', `Mangaboss`, 'https://mangaboss.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangaboss extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaboss';
        super.label = 'Mangaboss';
        this.tags = [ 'manga', 'english', 'webtoon' ];
        this.url = 'https://mangaboss.org';
    }
}
*/
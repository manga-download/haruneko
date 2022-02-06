// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mangabaz.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabaz', `Mangabaz`, 'https://mangabaz.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangabaz extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangabaz';
        super.label = 'Mangabaz';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://mangabaz.com';
    }
}
*/
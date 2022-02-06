// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mangax18.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangax18', `Mangax18`, 'https://mangax18.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangax18 extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangax18';
        super.label = 'Mangax18';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangax18.com';
    }
}
*/
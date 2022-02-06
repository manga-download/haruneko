// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaKik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakik', `MangaKik`, 'https://mangakik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKik extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangakik';
        super.label = 'MangaKik';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangakik.com';
    }
}
*/
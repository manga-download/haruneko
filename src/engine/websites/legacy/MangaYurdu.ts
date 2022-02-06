// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaYurdu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangayurdu', `Manga Yurdu`, 'https://mangayurdu.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaYurdu extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangayurdu';
        super.label = 'Manga Yurdu';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://mangayurdu.com';
    }
}
*/
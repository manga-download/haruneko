// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaGohan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagohan', `Manga Gohan`, 'https://mangagohan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGohan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangagohan';
        super.label = 'Manga Gohan';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://mangagohan.com';
    }
}
*/
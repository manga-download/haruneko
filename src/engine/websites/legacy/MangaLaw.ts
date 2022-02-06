// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaLaw.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalaw', `Mangalaw`, 'https://mangalaw.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLaw extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangalaw';
        super.label = 'Mangalaw';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://mangalaw.com';
    }
}
*/
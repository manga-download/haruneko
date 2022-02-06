// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaReadCO.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangareadco', `Manga Read`, 'https://mangaread.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaReadCO extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangareadco';
        super.label = 'Manga Read';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangaread.co';
    }
}
*/
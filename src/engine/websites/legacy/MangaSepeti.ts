// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSepeti.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasepeti', `Manga Sepeti`, 'https://www.mangasepeti.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSepeti extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasepeti';
        super.label = 'Manga Sepeti';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.mangasepeti.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaKitsu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakitsu', `Manga Kitsu`, 'https://mangakitsu.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKitsu extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangakitsu';
        super.label = 'Manga Kitsu';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangakitsu.com';
    }
}
*/
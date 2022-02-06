// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaOkur.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaokur', `Manga Okur`, 'https://www.mangaokur.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaOkur extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaokur';
        super.label = 'Manga Okur';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://www.mangaokur.com';
    }
}
*/
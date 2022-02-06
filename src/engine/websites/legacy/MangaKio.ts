// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaKio.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakio', `Manga Kio`, 'https://mangakio.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKio extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangakio';
        super.label = 'Manga Kio';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://mangakio.com';
    }
}
*/
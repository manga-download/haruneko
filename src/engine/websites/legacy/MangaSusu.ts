// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSusu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasusu', `MangaSusu`, 'https://m.mangasusu.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSusu extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'mangasusu';
        super.label = 'MangaSusu';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://m.mangasusu.co';

        this.language = 'id';
    }
}
*/
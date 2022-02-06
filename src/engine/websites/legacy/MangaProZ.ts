// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaProZ.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaproz', `Manga Pro Z`, 'https://mangaproz.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaProZ extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaproz';
        super.label = 'Manga Pro Z';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaproz.com';
        this.path = '/manga/list-mode/';
    }
}
*/
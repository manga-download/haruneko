// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaGenki.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagenki', `MangaGenki`, 'https://mangagenki.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGenki extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangagenki';
        super.label = 'MangaGenki';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangagenki.com';
        this.path = '/manga/?list';
    }
}
*/
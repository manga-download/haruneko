// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaEdenIT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeden-it', `MangaEdenIT`, 'https://www.mangaeden.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaEdenIT extends MangaEden {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangaeden-it';
        super.label = 'MangaEdenIT';
        this.tags = [ 'manga', 'italian' ];
        this.url = 'https://www.mangaeden.com';
        this.urlMangas = '/it/it-directory/';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaEdenEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeden-en', `MangaEdenEN`, 'https://www.mangaeden.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaEdenEN extends MangaEden {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangaeden-en';
        super.label = 'MangaEdenEN';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://www.mangaeden.com';
        this.urlMangas = '/en/en-directory/';
    }
}
*/
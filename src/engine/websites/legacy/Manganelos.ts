// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manganelos.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganelos', `Manganelos (by AnyACG)`, 'http://manganelos.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manganelos extends AnyACG {

    constructor() {
        super();
        super.id = 'manganelos';
        super.label = 'Manganelos (by AnyACG)';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'http://manganelos.com';

        this.queryPages = 'div.chapter-content-inner p#arraydata';
        this.queryMangaTitle = 'ol > li:nth-child(3)';
        this.queryMangaTitleText = 'a';
        this.queryChapters = '#examples a';
        this.queryMangaLink = 'a';
        this.queryMangas ='div.media-body';
    }
}
*/
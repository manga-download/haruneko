// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikIndoId.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindoid', `KomikIndoId`, 'https://komikindo.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikIndoId extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikindoid';
        super.label = 'KomikIndoId';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikindo.id';
        this.path = '/daftar-komik/?list';

        this.querMangaTitleFromURI = 'main div.post-body h1.entry-title';
        this.queryMangas = '.daftarkartun #abtext .jdlbar ul li a';
        this.queryChapters = 'div#chapter_list span.lchx a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.chapter-area div.chapter-image img[src]:not([src=""])';
    }
}
*/
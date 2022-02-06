// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BacaKomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacakomik', `BacaKomik`, 'https://bacakomik.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BacaKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'bacakomik';
        super.label = 'BacaKomik';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://bacakomik.co';
        this.path = '/daftar-manga/?list';

        this.queryMangas = 'div.cpp div.daftarkartun div.jdlbar ul li a.tip';
        this.queryChapters = 'div.eps_lst ul li span.lchx a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.chapter-area div.chapter-content div.chapter-image img';
    }
}
*/
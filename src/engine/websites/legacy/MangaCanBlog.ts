// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaCanBlog.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacanblog', `MangaCan Blog`, 'https://mangacanblog.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaCanBlog extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangacanblog';
        super.label = 'MangaCan Blog';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangacanblog.com';
        this.path = '/daftar-komik-manga-bahasa-indonesia.html';
        this.queryMangas = 'div.blix ul li a.series';
    }

}
*/
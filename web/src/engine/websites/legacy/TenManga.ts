// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TenManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tenmanga', `TenManga`, 'https://www.tenmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TenManga extends TAADD {

    constructor() {
        super();
        super.id = 'tenmanga';
        super.label = 'TenManga';
        this.tags = [ 'manga', 'english' ];
        this.url = 'http://www.tenmanga.com';
        this.links = {
            login: 'http://www.tenmanga.com/login'
        };

        //this.bypassAdultWarning = true;
        this.queryMangaTitle = 'div.container_book div.book-info h1';
        this.queryMangas = 'ul#list_container li dd.book-list > a:first-of-type';
        this.queryChapters = 'ul.chapter-box li div.chapter-name.short a';
        this.queryPages = 'select.sl-page';
        this.queryImages = 'div.pic_box source.manga_pic';
    }
}
*/
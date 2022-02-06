// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LxHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lxhentai', `LxHentai(Hentai LXX)`, 'https://lxhentai.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LxHentai extends MojoPortalComic {

    constructor() {
        super();
        super.id = 'lxhentai';
        super.label = 'LxHentai(Hentai LXX)';
        this.tags = [ 'manga', 'hentai', 'vietnamese' ];
        this.url = 'https://lxhentai.com';

        this.queryMangaTitle = 'head title';
        this.queryChapter = 'div#listChuong li.row a';
        this.queryPages = 'div.reader div:not([class]) source';
        this.path = '/story/search.php?key=&status=&flexCat=&&type=&p=';
        this.queryMangasPageCount = 'ul.pagination li.page-item:last-child a';
        this.pathMatch = /p=(\d+)/;
        this.queryMangas = 'div.container div.row div.col-md-2 a';
    }
}
*/
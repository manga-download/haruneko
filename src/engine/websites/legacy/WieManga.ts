// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WieManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wiemanga', `WieManga`, 'https://www.wiemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WieManga extends TAADD {

    constructor() {
        super();
        super.id = 'wiemanga';
        super.label = 'WieManga';
        this.tags = [ 'manga', 'german' ];
        this.url = 'https://www.wiemanga.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.bypassAdultWarning = false;
        this.queryMangaTitle = 'div.mangabookbox div.bookmessagebox h1';
        this.queryMangas = 'table tr td a.resultbookname';
        this.queryChapters = 'div.chapterlist table tr td.col1 a';
        this.queryPages = 'select#page';
        this.queryImages = 'source#comicpic';
    }
}
*/
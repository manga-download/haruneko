// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaRussia.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarussia', `MangaRussia`, 'http://www.mangarussia.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRussia extends TAADD {

    constructor() {
        super();
        super.id = 'mangarussia';
        super.label = 'MangaRussia';
        this.tags = [ 'manga', 'russian' ];
        this.url = 'http://www.mangarussia.com';
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
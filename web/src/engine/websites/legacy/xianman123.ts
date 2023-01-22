// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './xianman123.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xianman123', `XianMan123`, 'https://www.xianman123.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class xianman123 extends MH {

    constructor() {
        super();
        super.id = 'xianman123';
        super.label = 'XianMan123';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.xianman123.com';

        this.path = '/f-1-0-0-0-0-2-%PAGE%.html';
        this.queryMangasPageCount = 'div.page-pagination ul.pagination li:nth-last-child(3) a';
        this.pathMatch = /f-1-0-0-0-0-2-(\d+)/;
        this.queryChapter = 'div#chapterlistload ul#detail-list-select-1 li a';
        this.queryPages = /picdata\s*=\s*(\[[^\]]+\])\s*;/g;
    }

    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchRegex(request, this.queryPages);
        let imgDomain = await this.fetchRegex(request, /imgDomain\s*=\s*'([^']+)\s*'/g);
        data = Object.values(JSON.parse(data));
        return data.map(element => new URL(element, imgDomain[0]).href);
    }
}
*/
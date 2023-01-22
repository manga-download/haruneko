// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaParkToday.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaparktoday', `MangaPark.Today`, 'http://mangapark.today' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaParkToday extends MangaNel {
    constructor() {
        super();
        super.id = 'mangaparktoday';
        super.label = 'MangaPark.Today';
        this.tags = [ 'manga', 'webtoon', 'english'];
        this.url = 'http://mangapark.today';

        this.path = '/latest-manga?page=';
        this.queryMangas = 'div.row div.cate-manga div.col-md-6 div.media.mainpage-manga div.media-body > a';
        this.queryMangasPageCount = 'div.pagination ul.pagination li:nth-last-of-type(2) a';
        // this.queryChapters = 'section#examples div.content.mCustomScrollbar div.chapter-list ul li.row div.chapter h4 a.xanh';
        this.queryPages = 'div.each-page #arraydata';
        this.queryMangaTitle = 'div.media-body h1.title-manga';
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, this.queryPages);
        return data[0].textContent.split(',').map(el => this.getAbsolutePath(el.trim(), request.url));
    }

    canHandleURI(uri) {
        // Test: https://regex101.com/r/aPR3zy/3/tests
        return /^(m\.|chap\.)?mangapark\.today$/.test(uri.hostname);
    }
}
*/
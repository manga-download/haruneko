// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Guoman8.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('guoman8', `国漫吧 (Guoman8)`, 'http://www.guoman8.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Guoman8 extends SinMH {

    constructor() {
        super();
        super.id = 'guoman8';
        super.label = '国漫吧 (Guoman8)';
        this.tags = [ 'manga', 'chinese' ];
        this.url = 'http://www.guoman8.cc';
        this.requestOptions.headers.set('x-referer', this.url);

        this.path = '/list/p-%PAGE%';
        this.queryMangasPageCount = 'div.pager-cont span.pager a:nth-last-of-type(2)';
        this.queryChapters = 'div.chapter-list ul li a';
        this.queryPagesScript =`
            new Promise(resolve => resolve(cInfo.fs.map(img => 'http://' + pageConfig.host.auto + img)));
        `;
    }
}
*/
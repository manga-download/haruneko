// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Dmzj.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dmzj', `动漫之家(DMZJ)`, 'https://www.dmzj.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Dmzj extends SinMH {

    constructor() {
        super();
        super.id = 'dmzj';
        super.label = '动漫之家(DMZJ)';
        this.tags = [ 'manga', 'chinese', 'webtoon' ];
        this.url = 'https://www.dmzj.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.queryChapters = 'div.tab-content-selected ul li a';
        this.queryManga = 'div.comic_deCon > h1';
        this.path = '/category/0-0-0-0-0-0-%PAGE%.html';
        this.queryMangasPageCount = 'a.pg_last';
        this.queryMangas = 'h3 > a';

        this.queryPagesScript =`
            new Promise(resolve => {
                resolve(picArry.map(el => new URL(el,img_prefix).href));
            });
        `;
    }
}
*/
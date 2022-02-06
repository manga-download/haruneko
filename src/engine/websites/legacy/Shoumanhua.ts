// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Shoumanhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shoumanhua', `受漫画 (Shoumanhua)`, 'http://www.shoumanhua.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Shoumanhua extends SinMH {

    constructor() {
        super();
        super.id = 'shoumanhua';
        super.label = '受漫画 (Shoumanhua)';
        this.tags = [ 'manga', 'chinese', 'webtoon' ];
        this.url = 'http://www.shoumanhua.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.queryChapters = '#mh-chapter-list-ol-0 a';
        this.queryManga = 'div.book-cont div.book-detail div.book-title h1';
        this.path = '/all/%PAGE%.html';
        this.queryMangasPageCount = 'div.NewPages li:last-child > a';
        this.queryMangas = 'div.cy_list_mh ul li.title a';

        this.queryPagesScript =`
            new Promise(resolve => {
                resolve(qTcms_S_m_murl.split('$qingtiandy$'));
            });
        `;
    }
}
*/
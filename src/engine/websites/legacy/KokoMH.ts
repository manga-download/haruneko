// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KokoMH.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kokomh', `520漫画网 (KokoMH)`, 'https://www.kokomh.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KokoMH extends SinMH {

    constructor() {
        super();
        super.id = 'kokomh';
        super.label = '520漫画网 (KokoMH)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.kokomh.com';

        this.path = '/all/%PAGE%.html';
        this.queryManga = '.mh-date-info-name h4 a';
        this.queryMangasPageCount = 'div.NewPages ul li:last-child a';
        this.queryMangasPageCountMatch = /(\d+)(\/|\.html)?$/;
        this.queryMangas = 'div.mh-works-title h4 a';
        this.queryChaptersScript = `
            new Promise(resolve => {
                let chapters = [...document.querySelectorAll('ul#mh-chapter-list-ol-0 li a')].map(element => {
                    return {
                        id: element.pathname,
                        title: element.text.trim()
                    };
                });
                resolve(chapters);
            });
        `;
        this.queryPagesScript = `
            new Promise(resolve => {
                resolve(new Array(qTcms_page.total).fill().map((_, ind) => new URL(getPicUrlP(qTcms_S_m_murl, ind+1), qTcms_m_weburl).href));
            });
        `;
    }
}
*/
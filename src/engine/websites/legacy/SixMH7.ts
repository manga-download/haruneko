// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SixMH7.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('6mh7', `6漫画 (6mh7)`, 'https://www.6mh7.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SixMH7 extends SinMH {

    constructor() {
        super();
        super.id = '6mh7';
        super.label = '6漫画 (6mh7)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'http://www.6mh7.com';

        this.path = '/sort/1-%PAGE%.html';
        this.queryManga = 'div.cy_main div.cy_info div.cy_title h1';
        this.queryMangasPageCount = 'div.NewPages ul li:last-of-type a';
        this.queryMangas = 'div.cy_list_mh ul li.title a';
        this.queryChaptersScript = `
            new Promise((resolve, reject) => {
                charpterMore(null);
                setInterval(() => {
                    try {
                        if(!document.querySelector('a#zhankai:not([style*="none"])')) {
                            const chapters = [...document.querySelectorAll('ul[id^="mh-chapter-list"] li a')].map(element => {
                                return {
                                    id: element.pathname,
                                    title: element.text.trim()
                                }
                            });
                            resolve(chapters);
                        }
                    } catch(error) {
                        reject(error);
                    }
                }, 500);
            });
        `;
        this.queryPagesScript = `
            new Promise(resolve => resolve(newImgs));
        `;
    }
}
*/
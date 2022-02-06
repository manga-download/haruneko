// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manmankan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manmankan', `漫漫看漫画网 (ManManKan)`, 'https://manmankan.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manmankan extends SinMH {

    constructor() {
        super();
        super.id = 'manmankan';
        super.label = '漫漫看漫画网 (ManManKan)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://manmankan.cc';

        this.path = '/sort/%PAGE%.html';
        this.queryManga = 'div.cy_main div.cy_info div.cy_title h1';
        this.queryMangasPageCount = 'a.mylast';
        this.queryMangas = 'div.cy_list_mh ul li.title a';
        this.queryChaptersScript = `
            new Promise(resolve =>{
                resolve([...document.querySelectorAll('#mh-chapter-list-ol-0 > li > a')].map(ele => {
                    return{
                        id:ele.href,
                        title:ele.text.trim()
                    };
                }));
            });
        `;
        this.queryPagesScript = `
            new Promise(resolve => resolve(picArry));
        `;
    }
}
*/
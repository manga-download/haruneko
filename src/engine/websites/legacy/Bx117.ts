// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Bx117.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bx117', `117漫画网 (bx117)`, 'http://m.bx117.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Bx117 extends Connector {

    constructor() {
        super();
        super.id = 'bx117';
        super.label = '117漫画网 (bx117)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'http://m.bx117.com';
    }
    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'p.txtItme.h1');
        const id = uri.pathname + uri.search;
        const title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getChapters(manga) {
        const request = new Request(this.url + manga.id, this.requestOptions);
        const data = await this.fetchDOM(request, 'a.d-nowrap', 3);
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim()
            };
        });
    }

    async _getPages(chapter) {
        const script = `
            new Promise(resolve => {
                resolve(new Array(qTcms_page.total).fill().map((_,ind) => new URL(getPicUrlP(qTcms_S_m_murl,ind+1),qTcms_m_weburl).href));
            });
        `;
        const request = new Request(this.url + chapter.id, this.requestOptions);
        return await Engine.Request.fetchUI(request, script);
    }

    async _getMangas() {
        let mangaList = [];
        for(let i = 1; i <= 2; i++) {
            for(let page = 1, run = true; run; page++) {
                let mangas = await this._getMangasFromPage(page, i);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return mangaList;
    }

    async _getMangasFromPage(page, serial) {
        const request = new Request('http://m.bx117.com/statics/qingtiancms.ashx', {
            method: 'POST',
            body: new URLSearchParams({
                page: page,
                action:'GetWapList',
                _id:'listbody',
                pagesize:12,
                order:1,
                classid1:0,
                url:'/statics/qingtiancms.ashx',
                typelianzai:`110${serial}`
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            }
        });
        const data = await this.fetchDOM(request, 'li', 3);
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element.querySelector('a'), this.url),
                title: element.textContent.trim()
            };
        });
    }
}
*/
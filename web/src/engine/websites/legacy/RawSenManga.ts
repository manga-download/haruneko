// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RawSenManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawsenmanga', `RawSenManga`, 'https://raw.senmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RawSenManga extends Connector {

    constructor() {
        super();
        super.id = 'rawsenmanga';
        super.label = 'RawSenManga';
        this.tags = [ 'manga', 'raw', 'japanese' ];
        this.url = 'https://raw.senmanga.com';
        this.links = {
            login: 'https://raw.senmanga.com/login'
        };
        this.requestOptions.headers.set('x-cookie', 'viewer=1');
    }

    async _getMangas() {
        let mangaList = [];
        let request = new Request(this.url + '/directory', this.requestOptions);
        let data = await this.fetchDOM(request, 'div.content ul.pagination li:nth-last-of-type(2) a.page-link');
        let pageCount = parseInt(data[0].textContent.trim());
        for(let page = 1; page <= pageCount; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let request = new Request(this.url + '/directory?page=' + page, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.content div.upd div.item > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.querySelector('div.series-title').textContent.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(this.url + manga.id, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.content ul.chapter-list li > a.series');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let script = `
            new Promise(resolve => {
                resolve(imglist.map(img => img.url));
            });
        `;
        let request = new Request(this.url + chapter.id, this.requestOptions);
        return Engine.Request.fetchUI(request, script);
    }
}
*/
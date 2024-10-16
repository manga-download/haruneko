// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AllHentai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('allhentai', `AllHentai`, 'https://z.ahen.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AllHentai extends Connector {

    constructor() {
        super();
        super.id = 'allhentai';
        super.label = 'AllHentai';
        this.tags = ['hentai', 'russian'];
        this.url = 'http://allhentai.ru';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'meta[itemprop="name"]', 3);
        let id = uri.pathname;
        let title = data[0].content.trim();
        return new Manga(this, id, title);
    }

    async _getMangaListFromPages(mangaPageLinks, index) {
        index = index || 0;
        let data = await this.fetchDOM(mangaPageLinks[index], 'div#mangaBox div.desc h3 a', 5);
        let mangaList = data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.textContent.trim()
            };
        });
        if(index < mangaPageLinks.length - 1) {
            let mangas = await this._getMangaListFromPages(mangaPageLinks, index + 1);
            return mangaList.concat(mangas);
        } else {
            return mangaList;
        }
    }

    async _getMangaList( callback ) {
        try {
            let request = new Request(this.url + '/list', this.requestOptions);
            let data = await this.fetchDOM(request, 'span.pagination:first-of-type a.step');
            let pageCount = parseInt(data.pop().text);
            let pageLinks = [...new Array(pageCount).keys()].map(page => {
                let uri = new URL('list', this.url);
                uri.searchParams.set('offset', 70 * page);
                return uri.href;
            });
            let mangaList = await this._getMangaListFromPages(pageLinks);
            callback(null, mangaList);
        } catch(error) {
            console.error(error, this);
            callback(error, undefined);
        }
    }

    async _getChapterList(manga, callback) {
        try {
            let request = new Request(this.url + manga.id, this.requestOptions);
            let data = await this.fetchDOM(request, 'div.chapters-link table tr td a[title]');
            let chapterList = data.map(element => {
                return {
                    id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                    title: element.text.replace(manga.title, '').trim(),
                    language: ''
                };
            });
            callback(null, chapterList);
        } catch(error) {
            console.error(error, manga);
            callback(error, undefined);
        }
    }

    async _getPageList(manga, chapter, callback) {
        try {
            let script = `new Promise(resolve => {
                resolve(rm_h.pics.map(picture => picture.url));
            });`;
            let request = new Request(this.url + chapter.id, this.requestOptions);
            let data = await Engine.Request.fetchUI(request, script);
            callback(null, data);
        } catch(error) {
            console.error(error, chapter);
            callback(error, undefined);
        }
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SundayWebry.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sundaywebry', `サンデーうぇぶり (Sunday Webry)`, 'https://www.sunday-webry.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SundayWebry extends Connector {

    constructor() {
        super();
        super.id = 'sundaywebry';
        super.label = 'サンデーうぇぶり (Sunday Webry)';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://www.sunday-webry.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'head title');
        let id = uri.pathname + uri.search;
        let title = data[0].text.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        for(let page of ['/serialized.php', '/updated.php', '/yoru-sunday.php']) {
            let mangas = await this._getMangasFromPage(page);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let request = new Request(new URL(page, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.mangalist-block__list a.mangalist-block__item');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.querySelector('div.mangalist-block__item--title').textContent.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(new URL(manga.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.detail-block__list a.detail-block__item');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.querySelector('div.detail-block__item--title').textContent.trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let script = `
            new Promise(resolve => resolve(pages.filter(page => page.src)));
        `;
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await Engine.Request.fetchUI(request, script);
        return data.map(page => {
            let uri = this.getAbsolutePath(page.src, request.url);
            if(page.encryption_hex) {
                return this.createConnectorURI({ url: uri, key: page.encryption_hex });
            } else {
                return uri;
            }
        });
    }

    async _handleConnectorURI(payload) {
        let request = new Request(payload.url, this.requestOptions);
        let response = await fetch(request);
        let data = await response.arrayBuffer();
        return {
            mimeType: response.headers.get('content-type'),
            data: this._decryptImage(data, payload.key)
        };
    }

    _decryptImage(encrypted, key) {
        // create a view for the buffer
        let bin = new Uint8Array(key.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
        let decrypted = new Uint8Array(encrypted);
        for(let index in decrypted) {
            decrypted[index] ^= bin[index % bin.length];
        }
        return decrypted;
    }
}
*/
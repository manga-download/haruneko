// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NineEkor.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('9ekor', `9ekor`, 'https://9ekor.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NineEkor extends Connector {

    constructor() {
        super();
        super.id = '9ekor';
        super.label = '9ekor';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://9ekor.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'main.site-main header.page-header h1.entry-title');
        let id = uri.pathname;
        let title = data[0].textContent.trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let request = new Request(new URL('/daftar-isi/', this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.letter-section ul.columns li a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(new URL(`${manga.id}`, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'article.post h3.entry-title a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.replace(manga.title, '').replace(/Baca komik/i, '').replace(/Bahasa Indonesia/i, '').trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'main.site-main div.page-content p source');
        return data.map(element => this.getAbsolutePath(element, request.url));
    }
}
*/
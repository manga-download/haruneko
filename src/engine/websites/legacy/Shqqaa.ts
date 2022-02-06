// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Shqqaa.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shqqaa', `موقع شقاع (Shqqaa)`, 'https://www.shqqaa.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Shqqaa extends Connector {

    constructor() {
        super();
        super.id = 'shqqaa';
        super.label = 'موقع شقاع (Shqqaa)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://www.shqqaa.com';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'head title');
        let id = uri.pathname;
        let title = data[0].text.split(' | ')[0].trim();
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let request = new Request(new URL('/manga/', this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div.card div.card-body h6.card-title a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        let request = new Request(this.url + manga.id, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.card.card-body div.text-center a[role="button"]');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.text.trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let request = new Request(this.url + chapter.id, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.img-manga source');
        return data.map(element => this.getAbsolutePath(element, request.url));
    }
}
*/
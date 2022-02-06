// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WIBTranslation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wibtranslation', `WIB Translation`, 'https://www.wib.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WIBTranslation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'wibtranslation';
        super.label = 'WIB Translation';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://www.wib.my.id';

        this.queryPages = 'div#readerarea img, div#readarea img';
    }

    async _getMangas() {
        const uri = new URL('/feeds/posts/default/-/Series?alt=json&max-results=500', this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchJSON(request);
        return data.feed.entry.map(entry => {
            return {
                id: entry.content['$t'].match(/\/feeds\/posts\/default\/-\/[^?]+/).shift(),
                title: entry.title['$t'].trim()
            };
        });
    }

    async _getChapters(manga) {
        const uri = new URL(manga.id + '?alt=json&max-results=999', this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchJSON(request);
        return data.feed.entry.map(entry => {
            entry = entry.link.filter(link => link.rel === 'alternate').shift();
            return {
                id: this.getRootRelativeOrAbsoluteLink(entry.href, this.url),
                title: entry.title
            };
        });
    }
}
*/
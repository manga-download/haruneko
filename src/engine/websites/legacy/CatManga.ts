// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CatManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('catmanga', `CatManga`, 'https://catmanga.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CatManga extends Connector {

    constructor() {
        super();
        super.id = 'catmanga';
        super.label = 'CatManga';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://catmanga.org';
    }

    async _getEmbeddedJSON(uri) {
        const request = new Request(uri, this.requestOptions);
        const scripts = await this.fetchDOM(request, 'script#__NEXT_DATA__');
        const data = JSON.parse(scripts[0].text);
        return data.props.pageProps;
    }

    async _getMangaFromURI(uri) {
        const data = await this._getEmbeddedJSON(uri);
        return new Manga(this, data.series.series_id, data.series.title);
    }

    async _getMangas() {
        const uri = new URL('/', this.url);
        const data = await this._getEmbeddedJSON(uri);
        return data.series.map(item => {
            return {
                id: item.series_id,
                title: item.title.trim()
            };
        });
    }

    async _getChapters(manga) {
        const uri = new URL('/series/' + manga.id, this.url);
        const data = await this._getEmbeddedJSON(uri);
        return data.series.chapters.map(item => {
            let title = [];
            if(item.volume) {
                title.push('Vol.', item.volume);
            }
            title.push('Ch.', item.number);
            if(item.title) {
                title.push('-', item.title);
            }
            if(item.groups.length) {
                title.push('[' + item.groups.join(', ') + ']');
            }
            return {
                id: item.number,
                title: title.join(' ')
            };
        });
    }

    async _getPages(chapter) {
        const uri = new URL([ '', 'series', chapter.manga.id, chapter.id ].join('/'), this.url);
        const data = await this._getEmbeddedJSON(uri);
        return data.pages;
    }
}
*/
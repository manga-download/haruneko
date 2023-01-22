// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KooManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('koomanga', `KooManga`, 'https://koomanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KooManga extends WordPressZbulu {

    constructor() {
        super();
        super.id = 'koomanga';
        super.label = 'KooManga';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://koomanga.com';
    }

    canHandleURI(uri) {
        return /https?:\/\/w+\d*.koomanga.com/.test(uri.origin);
    }

    async _initializeConnector() {
        let uri = new URL(this.url);
        let request = new Request(uri.href, this.requestOptions);
        this.url = await Engine.Request.fetchUI(request, `window.location.origin`);
        console.log(`Assigned URL '${this.url}' to ${this.label}`);
    }

    getFormatRegex() {
        return{
            chapterRegex:/\s*(?:^|ch\.?|ep\.?|chapter|chap|chapitre|episode|#)\s*([\d.?\-?v?]+)(?:\s|:|$)+/i,
            volumeRegex:/\s*(?:vol\.?|volume|tome)\s*(\d+)/i
        };
    }
}
*/
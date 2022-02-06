// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HeavenManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('heavenmanga', `MyToon`, 'https://mytoon.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HeavenManga extends WordPressZbulu {

    constructor() {
        super();
        super.id = 'heavenmanga';
        super.label = 'MyToon';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://mytoon.net';
    }

    canHandleURI(uri) {
        return /https?:\/\/(w+\d*.)?mytoon.net/.test(uri.origin);
    }

    async _initializeConnector() {
        let uri = new URL(this.url);
        let request = new Request(uri.href, this.requestOptions);
        this.url = await Engine.Request.fetchUI(request, `window.location.origin`);
        console.log(`Assigned URL '${this.url}' to ${this.label}`);
    }

    async _getPages(chapter) {
        const pages = await super._getPages(chapter);
        return pages.filter(page => !/cover.png$/.test(page));
    }
}
*/
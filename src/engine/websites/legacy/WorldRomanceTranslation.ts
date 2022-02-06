// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WorldRomanceTranslation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('worldromancetranslation', `World Romance Translation`, 'https://wrt.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WorldRomanceTranslation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'worldromancetranslation';
        super.label = 'World Romance Translation';
        this.tags = ['manga', 'indonesian'];
        this.url = 'https://wrt.my.id';
        this.path = '/manga/list-mode/';

        this.queryChapters = 'div#chapterlist ul li div.eph-num a:last-of-type';
    }

    async _getPages(chapter) {
        const images = await super._getPages(chapter);
        return images.map(link => this.createConnectorURI({
            url: link,
            referer: this.url
        }));
    }

    async _handleConnectorURI(payload) {
        let request = new Request(payload.url, this.requestOptions);
        request.headers.set('x-referer', payload.referer);
        let response = await fetch(request);
        let data = await response.blob();
        return this._blobToBuffer(data);
    }
}
*/
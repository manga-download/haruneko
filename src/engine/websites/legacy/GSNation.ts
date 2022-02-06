// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GSNation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gsnation', `Gs-Nation`, 'https://gs-nation.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GSNation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gsnation';
        super.label = 'Gs-Nation';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://gs-nation.fr';
        this.path = '/manga/list-mode/';
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
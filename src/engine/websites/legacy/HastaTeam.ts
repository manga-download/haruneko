// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HastaTeam.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hastateam', `Hasta Team`, 'https://hastareader.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HastaTeam extends FoolSlide {

    constructor() {
        super();
        super.id = 'hastateam';
        super.label = 'Hasta Team';
        this.tags = [ 'manga', 'high-quality', 'italian', 'scanlation' ];
        this.url = 'https://hastareader.com';

        this.path = '/slide/directory/';

        this.language = 'italian';
    }

    async _getPages(chapter) {
        let referer = new URL(chapter.id, this.url).href;
        let imageLinks = await super._getPages(chapter);
        return imageLinks.map(link => this.createConnectorURI({
            url: link,
            referer: referer
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
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Funbe.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('funbe', `Funbe`, 'https://funbe.shop' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Funbe extends GnuBoard5BootstrapBasic2 {

    constructor() {
        super();
        super.id = 'funbe';
        super.label = 'Funbe';
        this.tags = [ 'webtoon', 'hentai', 'korean' ];
        this.url = 'https://funbe.shop';
    }

    canHandleURI(uri) {
        return /https?:\/\/funbe\.[a-z]+/.test(uri.origin);
    }

    async _initializeConnector() {
        let uri = new URL(await this._twitter.getProfileURL('1087681227832754182') || this.url);
        let request = new Request(uri.href, this.requestOptions);
        this.url = await Engine.Request.fetchUI(request, `window.location.origin`);
        console.log(`Assigned URL '${this.url}' to ${this.label}`);
    }
}
*/
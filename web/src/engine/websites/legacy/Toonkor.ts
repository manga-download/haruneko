// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Toonkor.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonkor', `Toonkor`, 'https://tkor.zone' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Toonkor extends GnuBoard5BootstrapBasic2 {

    constructor() {
        super();
        super.id = 'toonkor';
        super.label = 'Toonkor';
        this.tags = ['webtoon', 'korean'];
        this.url = 'https://tkor.zone';
    }

    canHandleURI(uri) {
        return /https?:\/\/(?:toonkor|tkor)\.[a-z]+/.test(uri.origin);
    }

    async _initializeConnector() {
        let uri = new URL(await this._twitter.getProfileURL('1202224761771741184') || this.url);
        let request = new Request(uri.href, this.requestOptions);
        this.url = await Engine.Request.fetchUI(request, `window.location.origin`);
        console.log(`Assigned URL '${this.url}' to ${this.label}`);
    }
}
*/
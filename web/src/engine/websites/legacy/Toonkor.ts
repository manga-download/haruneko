// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

import { Tags } from '../../Tags';
import icon from './Toonkor.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonkor', `Toonkor`, 'https://toonkor0.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //this.URI.href = (await FetchCSS<HTMLAnchorElement>(new Request('https://t.me/s/new_toonkor'), 'a[href^="https://toonkor"]')).at(-1)?.origin ?? this.URI.href;
        const response = await fetch('https://itset.co/link/webtoon/toonkor');
        this.URI.href = new URL(response.url).origin;
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
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
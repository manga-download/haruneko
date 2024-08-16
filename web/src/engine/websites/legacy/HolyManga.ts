// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

import { Tags } from '../../Tags';
import icon from './HolyManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import { FetchWindowScript } from '../../platform/FetchProvider';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('holymanga', `Holy Manga`, 'https://holymanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}

// Original Source
/*
class HolyManga extends WordPressZbulu {

    constructor() {
        super();
        super.id = 'holymanga';
        super.label = 'Holy Manga';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://holymanga.net';
    }

    canHandleURI(uri) {
        return /https?:\/\/w+\d*.holymanga.net/.test(uri.origin);
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
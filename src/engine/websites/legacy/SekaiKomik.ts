// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SekaiKomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sekaikomik', `SekaiKomik`, 'https://www.sekaikomik.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SekaiKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'sekaikomik';
        super.label = 'SekaiKomik';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.sekaikomik.site';
        this.path = '/manga/list-mode/';
        this.requestOptions.headers.set('x-referer', this.url);
    }

    async _initializeConnector() {
        const paths = [ '/', '/manga/' ];
        for(let path of paths) {
            const uri = new URL(path, this.url);
            const request = new Request(uri, this.requestOptions);
            await Engine.Request.fetchUI(request, '', 25000, true);
        }
    }

    async _getPages(chapter) {
        const images = await super._getPages(chapter);
        return images.map(image => this.createConnectorURI(image));
    }
}
*/
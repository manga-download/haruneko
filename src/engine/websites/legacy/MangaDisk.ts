// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaDisk.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadisk', `Manga Disk`, 'https://mangadisk.web.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaDisk extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangadisk';
        super.label = 'Manga Disk';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangadisk.web.id';
        this.path = '/manga/list-mode/';
        this.queryPages = 'div#readerarea canvas';
        this.requestOptions.headers.set('x-referer', this.url);
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryPages);

        return data.map(hash => {
            return this.createConnectorURI('https://img.nesia.my.id/image?id='+hash.getAttribute('file-id'));
        });
    }
}
*/
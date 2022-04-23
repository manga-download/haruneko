// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AniMangaES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('animangaes', `ANIMANGAES`, 'https://animangaes.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AniMangaES extends WordPressMadara {

    constructor() {
        super();
        super.id = 'animangaes';
        super.label = 'ANIMANGAES';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://animangaes.com';

        this.queryPages = 'div.reading-content p source';
    }

    async _getPages(chapter) {
        let uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryPages);
        return data.map(element => this.createConnectorURI({
            url: this.getAbsolutePath(element.dataset['src'] || element['srcset'] || element, request.url),
            referer: request.url
        }));
    }
}
*/
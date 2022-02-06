// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaHere.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahere', `MangaHere`, 'https://www.mangahere.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaHere extends MangaFox {

    constructor() {
        super();
        super.id = 'mangahere';
        super.label = 'MangaHere';
        this.url = 'https://www.mangahere.cc';
    }

    async _getMangas() {
        let uri = new URL(`/mangalist/`, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.browse-new-block-list div.browse-new-block p.browse-new-block-content a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.title.trim()
            };
        });
    }
}
*/
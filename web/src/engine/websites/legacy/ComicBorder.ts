// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicBorder.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicborder', `コミックボーダー (ComicBorder)`, 'https://comicborder.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicBorder extends CoreView {

    constructor() {
        super();
        super.id = 'comicborder';
        super.label = 'コミックボーダー (ComicBorder)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comicborder.com';
    }

    async _getMangas() {
        let request = new Request(this.url, this.requestOptions);
        let data = await this.fetchDOM(request, 'ul.index-list-all li a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.lastChild.textContent.trim()
            };
        });
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSehri.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasehri', `Manga Şehri`, 'https://mangasehri.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSehri extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasehri';
        super.label = 'Manga Şehri';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://mangasehri.com';
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, this.queryPages);
        return data.map(element => this.getAbsolutePath(element.dataset.src || element, request.url)).filter(image => !/grumpybumpers/.test(image));
    }
}
*/
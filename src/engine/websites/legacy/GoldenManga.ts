// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GoldenManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goldenmanga', `المانجا الذهبية (Golden Manga)`, 'https://golden-manga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GoldenManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'goldenmanga';
        super.label = 'المانجا الذهبية (Golden Manga)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://golden-manga.com';
    }

    async _getChapters(manga) {
        let uri = new URL( manga.id, this.url );
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.page-content-listing div.main > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.querySelector('h6').textContent.trim(),
                language: ''
            };
        });
    }
}
*/
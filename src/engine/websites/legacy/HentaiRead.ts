// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HentaiRead.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentairead', `HentaiRead`, 'https://hentairead.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HentaiRead extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentairead';
        super.label = 'HentaiRead';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://hentairead.com';
    }

    // very similar to tritiniascans except that this websites uses an array instead of an object
    async _getPages(chapter) {
        let request = new Request(this.url + chapter.id, this.requestOptions);
        let response = await fetch(request);
        let data = await response.text();
        let chapterImages = data.match(/chapImages\s*=\s*(\[[^\]]+\])/);
        let preloadedImages = data.match(/chapter_preloaded_images\s*=\s*(\[[^\]]+\])/);
        let pageList = JSON.parse((chapterImages || preloadedImages)[1]);
        return pageList.map(link => {
            let uri = new URL(link);
            uri.searchParams.set('quality', '100');
            uri.searchParams.delete('w');
            return uri.href;
        });
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Kiryuu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kiryuu', `Kiryuu`, 'https://kiryuu.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Kiryuu extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'kiryuu';
        super.label = 'Kiryuu';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://kiryuu.id';
        this.path = '/manga/list-mode/';
    }

    async _getPages(chapter) {
        const fakeLinkPatterns = [
            /[.,]5\.(jpg|png)$/i,
            /iklan\.(jpg|png)$/i,
            /zz\.(jpg|png)$/i,
            /\.filerun\./i
        ];
        let pageList = await super._getPages(chapter);
        return pageList.filter(link => !fakeLinkPatterns.some(pattern => pattern.test(link)));
    }
}
*/
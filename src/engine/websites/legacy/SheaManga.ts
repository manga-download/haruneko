// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SheaManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sheamanga', `Shea Manga`, 'https://sheamanga.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SheaManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'sheamanga';
        super.label = 'Shea Manga';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://sheamanga.my.id';
        this.path = '/manga/list-mode/';
    }
}
*/
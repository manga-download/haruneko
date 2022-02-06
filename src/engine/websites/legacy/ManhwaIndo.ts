// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaIndo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaindo', `ManhwaIndo`, 'https://manhwaindo.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaIndo extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwaindo';
        super.label = 'ManhwaIndo';
        this.tags = ['webtoon', 'indonesian'];
        this.url = 'https://manhwaindo.com';
        this.path = '/series/list-mode/';
    }
}
*/
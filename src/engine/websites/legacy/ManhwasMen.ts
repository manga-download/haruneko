// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwasMen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasmen', `Manhwas Men`, 'https://manhwas.men' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwasMen extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'manhwasmen';
        super.label = 'Manhwas Men';
        this.tags = [ 'webtoon', 'hentai', 'korean', 'english' ];
        this.url = 'https://manhwas.men';
    }
}
*/
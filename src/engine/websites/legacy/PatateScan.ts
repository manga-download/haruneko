// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PatateScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('patatescan', `Patatescans`, 'https://patatescans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PatateScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'patatescan';
        super.label = 'Patatescans';
        this.tags = [ 'webtoon', 'hentai', 'french' ];
        this.url = 'https://patatescans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
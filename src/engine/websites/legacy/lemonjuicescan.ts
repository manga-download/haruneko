// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './lemonjuicescan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lemonjuicescan', `Lemon Juice Scan`, 'https://lemonjuicescan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class lemonjuicescan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lemonjuicescan';
        super.label = 'Lemon Juice Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://lemonjuicescan.com';
        this.path = '/manga/list-mode';
    }
}
*/
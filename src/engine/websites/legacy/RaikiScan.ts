// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RaikiScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raikiscan', `Raiki Scan`, 'https://raikiscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RaikiScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'raikiscan';
        super.label = 'Raiki Scan';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://raikiscan.com';
        this.path = '/manga/list-mode/';
    }
}
*/
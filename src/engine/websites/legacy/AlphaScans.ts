// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AlphaScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphascans', `Alpha Scans`, 'https://alpha-scans.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AlphaScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'alphascans';
        super.label = 'Alpha Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://alpha-scans.org';
        this.path = '/manga/list-mode/';
    }
}
*/
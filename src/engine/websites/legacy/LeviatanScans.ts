// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LeviatanScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leviatanscans-xxx', `LeviatanScans (XXX)`, 'https://xxx.leviatanscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LeviatanScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'leviatanscans-xxx';
        super.label = 'LeviatanScans (XXX)';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation', 'hentai'];
        this.url = 'https://xxx.leviatanscans.com';
    }
}
*/
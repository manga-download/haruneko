// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MMScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mmscans', `MMSCANS`, 'https://mm-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MMScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mmscans';
        super.label = 'MMSCANS';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mm-scans.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AncientEmpireScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ancientempirescan', `Ancient Empire Scan`, 'https://www.ancientempirescan.website' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AncientEmpireScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ancientempirescan';
        super.label = 'Ancient Empire Scan';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://www.ancientempirescan.website';
    }
}
*/
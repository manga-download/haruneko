// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CopyPasteScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('copypastescan', `Copy & Paste Scan`, 'https://copypastescan.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CopyPasteScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'copypastescan';
        super.label = 'Copy & Paste Scan';
        this.tags = [ 'manga', 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://copypastescan.xyz';
    }
}
*/
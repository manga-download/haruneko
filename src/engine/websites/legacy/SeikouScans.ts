// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SeikouScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('seikouscans', `Seikou Scans`, 'https://seikouscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SeikouScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'seikouscans';
        super.label = 'Seikou Scans';
        this.tags = ['high-quality', 'portuguese', 'scanlation', 'webtoon' ];
        this.url = 'https://seikouscans.com';
    }
}
*/
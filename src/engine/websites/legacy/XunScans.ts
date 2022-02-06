// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './XunScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xunscans', `XuNScans`, 'https://xunscans.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class XunScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'xunscans';
        super.label = 'XuNScans';
        this.tags = [ 'manga', 'english', 'scanlation' ];
        this.url = 'https://xunscans.xyz';
    }
}
*/
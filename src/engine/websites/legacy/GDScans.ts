// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GDScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gdscans', `GD Scans`, 'https://gdscan.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GDScans extends WordPressMadara {
    constructor() {
        super();
        super.id = 'gdscans';
        super.label = 'GD Scans';
        this.tags = [ 'manga', 'scanlation', 'english' ];
        this.url = 'https://gdscan.xyz';
    }
}
*/
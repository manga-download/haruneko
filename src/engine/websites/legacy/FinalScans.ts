// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FinalScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('finalscans', `Final Scans`, 'https://finalscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FinalScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'finalscans';
        super.label = 'Final Scans';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://finalscans.com';
    }
}
*/
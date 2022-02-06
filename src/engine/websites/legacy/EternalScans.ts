// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './EternalScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eternalscans', `Eternal Scans`, 'https://eternalscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EternalScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'eternalscans';
        super.label = 'Eternal Scans';
        this.tags = [ 'manga', 'english', 'webtoon', 'scanlation' ];
        this.url = 'https://eternalscans.com';
    }
}
*/
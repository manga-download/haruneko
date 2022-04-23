// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TheGuildScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('theguildscans', `The Guild Scans`, 'https://theguildscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TheGuildScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'theguildscans';
        super.label = 'The Guild Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://theguildscans.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TwilightScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('twilightscans', `Twilight Scans`, 'https://twilightscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TwilightScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'twilightscans';
        super.label = 'Twilight Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://twilightscans.com';
    }
}
*/
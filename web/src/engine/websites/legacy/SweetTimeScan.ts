// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SweetTimeScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sweettimescan', `Sweet Time Scan`, 'https://sweetscan.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SweetTimeScan extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'sweettimescan';
        super.label = 'Sweet Time Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://sweetscan.net';
    }
}
*/
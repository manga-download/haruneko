// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HunlightScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hunlightscans', `Hunlight Scans`, 'https://hunlight-scans.info' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HunlightScans extends Genkan {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'hunlightscans';
        super.label = 'Hunlight Scans';
        this.tags = [ 'manga', 'webtoon', 'english', 'high-quality', 'scanlation' ];
        this.url = 'https://hunlight-scans.info';
    }
}
*/
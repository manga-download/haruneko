// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KrakenScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('krakenscans', `Kraken Scans`, 'https://krakenscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KrakenScans extends Genkan {

    constructor() {
        super();
        super.id = 'krakenscans';
        super.label = 'Kraken Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://krakenscans.com';
    }
}
*/
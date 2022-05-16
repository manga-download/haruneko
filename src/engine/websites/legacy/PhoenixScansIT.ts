// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PhoenixScansIT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('phoenixscans-it', `Phoenix Scans`, 'https://phoenixscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PhoenixScansIT extends PizzaReader {

    constructor() {
        super();
        super.id = 'phoenixscans-it';
        super.label = 'Phoenix Scans';
        this.tags = [ 'manga', 'italian', 'scanlation' ];
        this.url = 'https://phoenixscans.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GTOTheGreatSite.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gtotgs', `GTO The Great Site`, 'https://reader.gtothegreatsite.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GTOTheGreatSite extends PizzaReader {

    constructor() {
        super();
        super.id = 'gtotgs';
        super.label = 'GTO The Great Site';
        this.tags = [ 'manga', 'italian', 'scanlation' ];
        this.url = 'https://reader.gtothegreatsite.net';
    }
}
*/
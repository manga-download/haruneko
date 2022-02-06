// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Opiatoon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('opiatoon', `Opiatoon (Opia&Shipperland)`, 'https://www.opiatoon.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Opiatoon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'opiatoon';
        super.label = 'Opiatoon (Opia&Shipperland)';
        this.tags = [ 'manga', 'turkish', 'webtoon' ];
        this.url = 'https://www.opiatoon.net';
    }
}
*/
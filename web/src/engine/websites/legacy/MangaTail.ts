// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaTail.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatail', `MangaTail`, 'https://www.mangatail.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaTail extends MangaSail {

    constructor() {
        super();
        super.id = 'mangatail';
        super.label = 'MangaTail';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://www.mangatail.me';
    }
}
*/
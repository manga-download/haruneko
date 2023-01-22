// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToonTH.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoon-th', `MangaToon (Thai)`, 'https://mangatoon.mobi/th' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonTH extends MangaToon {

    constructor() {
        super();
        super.id = 'mangatoon-th';
        super.label = 'MangaToon (Thai)';
        this.tags = [ 'webtoon', 'thai' ];
        this.url = 'https://mangatoon.mobi/th';
        this.path = '/th/genre?page=';
    }
}
*/
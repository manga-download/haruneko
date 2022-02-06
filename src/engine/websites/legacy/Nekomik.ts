// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Nekomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nekomik', `Nekomik`, 'https://nekomik.com/' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Nekomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'nekomik';
        super.label = 'Nekomik';
        this.tags = ['manga', 'indonesian'];
        this.url = 'https://nekomik.com/';
        this.path = '/manga/list-mode/';
    }
}
*/
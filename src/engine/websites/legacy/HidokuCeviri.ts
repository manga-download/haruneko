// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HidokuCeviri.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hidokuceviri', `Hidoku Çeviri`, 'http://oku.hidokuceviri.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HidokuCeviri extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'hidokuceviri';
        super.label = 'Hidoku Çeviri';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'http://oku.hidokuceviri.com';

        this.language = 'tr';
    }
}
*/
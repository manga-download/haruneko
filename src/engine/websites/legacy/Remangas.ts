// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Remangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('remangas', `Remangas`, 'https://remangas.top' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Remangas extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'remangas';
        super.label = 'Remangas';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://remangas.top';

        this.language = 'pt';
    }
}
*/
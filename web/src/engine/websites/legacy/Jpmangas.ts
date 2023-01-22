// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Jpmangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jpmangas', `Jpmangas`, 'https://www.jpmangas.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Jpmangas extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'jpmangas';
        super.label = 'Jpmangas';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://www.jpmangas.com';

        this.language = 'fr';
    }
}
*/
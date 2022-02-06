// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Caisemh.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('caisemh', `Caisemh`, 'https://www.caisemh.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Caisemh extends MH {

    constructor() {
        super();
        super.id = 'caisemh';
        super.label = 'Caisemh';
        this.tags = [ 'manga', 'webtoon', 'chinese', 'hentai' ];
        this.url = 'https://www.caisemh.com';

        this.queryPages = 'div.comicpage source';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CizgiRomanArsivi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cizgiromanarsivi', `Çizgi Roman Arşivi (CizgiRomanArsivi)`, 'https://cizgiromanarsivi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CizgiRomanArsivi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cizgiromanarsivi';
        super.label = 'Çizgi Roman Arşivi (CizgiRomanArsivi)';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://cizgiromanarsivi.com';
    }
}
*/
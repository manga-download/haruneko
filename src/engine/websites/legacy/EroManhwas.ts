// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './EroManhwas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eromanhwas', `Eromanhwas`, 'https://eromanhwas.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EroManhwas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'eromanhwas';
        super.label = 'Eromanhwas';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://eromanhwas.com';
    }
}
*/
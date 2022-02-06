// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Hentaidexy.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaidexy', `Hentaidexy`, 'https://hentaidexy.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Hentaidexy extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentaidexy';
        super.label = 'Hentaidexy';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://hentaidexy.com';
    }
}
*/
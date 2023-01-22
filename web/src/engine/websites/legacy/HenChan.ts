// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HenChan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('henchan', `Хентай-тян! (Hentai-chan)`, 'https://henchan.pro' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HenChan extends MangaChan {

    constructor() {
        super();
        super.id = 'henchan';
        super.label = 'Хентай-тян! (Hentai-chan)';
        this.tags = [ 'hentai', 'russian' ];
        this.url = 'https://henchan.pro';

        this.path = '/manga/new';
        this.queryChapters = 'div.extaraNavi p.extra_off:last-of-type a';
    }
}
*/
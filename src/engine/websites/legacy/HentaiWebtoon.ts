// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HentaiWebtoon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaiwebtoon', `Hentai Webtoon`, 'https://hentaiwebtoon.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HentaiWebtoon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentaiwebtoon';
        super.label = 'Hentai Webtoon';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://hentaiwebtoon.com';
    }
}
*/
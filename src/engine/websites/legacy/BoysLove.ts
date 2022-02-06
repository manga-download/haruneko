// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BoysLove.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('boyslove', `Boys Love`, 'https://boyslove.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BoysLove extends WordPressMadara {

    constructor() {
        super();
        super.id = 'boyslove';
        super.label = 'Boys Love';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'english' ];
        this.url = 'https://boyslove.me';
    }
}
*/
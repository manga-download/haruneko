// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WonderlandWebtoons.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wonderlandwebtoons', `Wonderland - Land Webtoons`, 'https://landwebtoons.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WonderlandWebtoons extends WordPressMadara {

    constructor() {
        super();
        super.id = 'wonderlandwebtoons';
        super.label = 'Wonderland - Land Webtoons';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://landwebtoons.site';
    }
}
*/
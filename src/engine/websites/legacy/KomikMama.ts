// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikMama.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikmama', `Komikmama`, 'https://komikmama.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikMama extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikmama';
        super.label = 'Komikmama';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikmama.net';
        this.path = '/manga/list-mode/';

        this.queryChapters = 'div.bxcl ul li div.lch a';
        this.queryChaptersTitle = undefined;
    }
}
*/
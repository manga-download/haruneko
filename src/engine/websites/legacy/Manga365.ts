// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manga365.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('365manga', `365Manga`, 'https://365manga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga365 extends WordPressMadara {

    constructor() {
        super();
        super.id = '365manga';
        super.label = '365Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://365manga.com';
    }
}
*/
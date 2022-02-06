// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './S2Manga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('s2manga', `S2Manga`, 'https://s2manga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class S2Manga extends WordPressMadara {

    constructor() {
        super();
        super.id = 's2manga';
        super.label = 'S2Manga';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://s2manga.com';
    }
}
*/
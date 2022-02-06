// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PojokManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pojokmanga', `PojokManga`, 'https://pojokmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PojokManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'pojokmanga';
        super.label = 'PojokManga';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://pojokmanga.com';

        this.queryTitleForURI = 'div.profile-manga div.post-title h1';
    }
}
*/
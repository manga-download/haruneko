// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DRKMangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('drkmangas', `DRK Mangas`, 'https://drkmangas.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DRKMangas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'drkmangas';
        super.label = 'DRK Mangas';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://drkmangas.site';
    }
}
*/
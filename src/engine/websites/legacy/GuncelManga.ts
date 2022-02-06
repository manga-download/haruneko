// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GuncelManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('guncelmanga', `Güncel Manga`, 'https://guncelmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GuncelManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'guncelmanga';
        super.label = 'Güncel Manga';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'https://guncelmanga.com';
    }
}
*/
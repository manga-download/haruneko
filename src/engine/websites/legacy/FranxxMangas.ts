// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FranxxMangas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('franxxmangas', `Franxx Mangas`, 'https://franxxmangas.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FranxxMangas extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'franxxmangas';
        super.label = 'Franxx Mangas';
        this.tags = [ 'manga', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://franxxmangas.net';
        this.path = '/manga/list-mode/';
    }
}
*/
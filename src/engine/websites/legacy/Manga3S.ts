// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manga3S.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga3s', `Manga3S`, 'https://manga3s.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga3S extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga3s';
        super.label = 'Manga3S';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manga3s.com';
    }
}
*/
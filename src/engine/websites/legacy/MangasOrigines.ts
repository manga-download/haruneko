// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangasOrigines.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasorigines', `Mangas Origines`, 'https://mangas-origines.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangasOrigines extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasorigines';
        super.label = 'Mangas Origines';
        this.tags = [ 'manga', 'webtoons', 'french' ];
        this.url = 'https://mangas-origines.fr';
    }
}
*/
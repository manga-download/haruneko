// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaLord.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalord', `Manga Lord`, 'https://www.mangalord.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLord extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangalord';
        super.label = 'Manga Lord';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.mangalord.com';
    }
}
*/
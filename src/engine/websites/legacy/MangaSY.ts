// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSY.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasy', `Manga SY`, 'https://www.mangasy.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSY extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasy';
        super.label = 'Manga SY';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.mangasy.com';
    }
}
*/
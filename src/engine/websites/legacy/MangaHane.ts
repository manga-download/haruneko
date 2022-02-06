// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaHane.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahane', `Manga Hane`, 'https://manga-hane.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaHane extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangahane';
        super.label = 'Manga Hane';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://manga-hane.com';
    }
}
*/
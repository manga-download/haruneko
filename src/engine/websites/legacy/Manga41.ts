// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manga41.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga41', `Manga 41`, 'https://manga41.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga41 extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga41';
        super.label = 'Manga 41';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manga41.com';
    }
}
*/
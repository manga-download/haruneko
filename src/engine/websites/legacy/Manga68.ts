// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manga68.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga68', `Manga68`, 'https://manga68.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga68 extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga68';
        super.label = 'Manga68';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manga68.com';
    }
}
*/
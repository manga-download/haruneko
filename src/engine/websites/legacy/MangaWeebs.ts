// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaWeebs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaweebs', `Manga Weebs`, 'https://mangaweebs.in' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWeebs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaweebs';
        super.label = 'Manga Weebs';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://mangaweebs.in';
    }
}
*/
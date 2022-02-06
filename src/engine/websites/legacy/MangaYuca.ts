// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaYuca.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangayuca', `MangaYuca`, 'https://mangayuca.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaYuca extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangayuca';
        super.label = 'MangaYuca';
        this.tags = ['webtoon', 'english', 'hentai'];
        this.url = 'https://mangayuca.com';
    }
}
*/
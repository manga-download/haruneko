// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaStein.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastein', `MangaStein`, 'https://mangastein.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaStein extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangastein';
        super.label = 'MangaStein';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://mangastein.com';
    }
}
*/
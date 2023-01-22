// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaOnlineFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaonlinefun', `MangaOnlineFun`, 'https://mangaonline.fun' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaOnlineFun extends MangaHub {

    constructor() {
        super();
        super.id = 'mangaonlinefun';
        super.label = 'MangaOnlineFun';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangaonline.fun';

        this.path = 'm02';
    }
}
*/
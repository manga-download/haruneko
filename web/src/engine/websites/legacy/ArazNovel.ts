// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ArazNovel.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('araznovel', `ArazNovel`, 'https://araznovel.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ArazNovel extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'araznovel';
        super.label = 'ArazNovel';
        this.tags = [ 'webtoon', 'novel', 'turkish' ];
        this.url = 'https://araznovel.com';
    }
}
*/
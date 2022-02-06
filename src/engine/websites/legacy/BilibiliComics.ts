// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BilibiliComics.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bilibili-comics', `Bilibili Comics`, 'https://www.bilibilicomics.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BilibiliComics extends BilibiliManhua {

    constructor() {
        super();
        super.id = 'bilibili-comics';
        super.label = 'Bilibili Comics';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.bilibilicomics.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwaSmut.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasmut', `ManhwaSmut`, 'https://manhwasmut.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaSmut extends FlatManga {

    constructor() {
        super();
        super.id = 'manhwasmut';
        super.label = 'ManhwaSmut';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://manhwasmut.com';

        this.queryChapters = 'div#tab-chapper div#list-chapters span.title a.chapter';
    }
}
*/
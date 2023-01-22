// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Seven8te.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('78te', `78te (特漫网)`, 'https://www.78te.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Seven8te extends MH {

    constructor() {
        super();
        super.id = '78te';
        super.label = '78te (特漫网)';
        this.tags = [ 'manga', 'webtoon', 'chinese', 'hentai' ];
        this.url = 'https://www.78te.com';
    }
}
*/
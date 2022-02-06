// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaStreamToday.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastreamtoday', `MangaStream (by AnyACG)`, 'http://readms.today' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaStreamToday extends AnyACG {

    constructor() {
        super();
        super.id = 'mangastreamtoday';
        super.label = 'MangaStream (by AnyACG)';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'http://readms.today';
    }
}
*/
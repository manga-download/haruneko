// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaNeloToday.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganelotoday', `MangaNelo (by AnyACG)`, 'http://manganelo.today' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNeloToday extends AnyACG {

    constructor() {
        super();
        super.id = 'manganelotoday';
        super.label = 'MangaNelo (by AnyACG)';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'http://manganelo.today';

        this.queryPages = 'div.chapter-content-inner p#arraydata';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaHanta.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahanta', `MangaHanta`, 'http://www.mangahanta.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaHanta extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'mangahanta';
        super.label = 'MangaHanta';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'http://www.mangahanta.com';

        this.language = 'tr';
    }
}
*/
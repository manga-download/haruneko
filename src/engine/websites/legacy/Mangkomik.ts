// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Mangkomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangkomik', `Mangkomik`, 'https://mangkomik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangkomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangkomik';
        super.label = 'Mangkomik';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://mangkomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/
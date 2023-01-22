// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaSee.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasee', `MangaSee`, 'https://mangasee123.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSee extends MangaLife {

    constructor() {
        super();
        super.id = 'mangasee';
        super.label = 'MangaSee';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangasee123.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
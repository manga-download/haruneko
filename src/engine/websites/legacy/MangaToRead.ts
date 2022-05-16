// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaToRead.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatoread', `MangaToRead`, 'https://mangatoread.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToRead extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangatoread';
        super.label = 'MangaToRead';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangatoread.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaStarz.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastarz', `مانجا ستارز (Mangastarz)`, 'https://mangastarz.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaStarz extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangastarz';
        super.label = 'مانجا ستارز (Mangastarz)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangastarz.com';
    }
}
*/
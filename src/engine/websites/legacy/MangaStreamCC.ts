// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaStreamCC.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangastreamcc', `MangaStream`, 'https://www.mangastream.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaStreamCC extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangastreamcc';
        super.label = 'MangaStream';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.mangastream.cc';
    }
}
*/
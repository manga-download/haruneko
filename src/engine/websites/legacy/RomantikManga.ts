// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RomantikManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('romantikmanga', `RomantikManga`, 'https://romantikmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RomantikManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'romantikmanga';
        super.label = 'RomantikManga';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://romantikmanga.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
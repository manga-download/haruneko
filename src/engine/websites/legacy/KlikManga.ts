// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KlikManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klikmanga', `KlikManga`, 'https://klikmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KlikManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'klikmanga';
        super.label = 'KlikManga';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://klikmanga.com';
    }
}
*/
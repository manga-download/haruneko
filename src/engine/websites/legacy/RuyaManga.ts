// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RuyaManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ruyamanga', `Rüya Manga`, 'https://www.ruyamanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RuyaManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ruyamanga';
        super.label = 'Rüya Manga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.ruyamanga.com';
    }
}
*/
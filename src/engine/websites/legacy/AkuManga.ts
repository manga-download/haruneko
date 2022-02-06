// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AkuManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('akumanga', `AkuManga`, 'https://akumanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AkuManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'akumanga';
        super.label = 'AkuManga';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://akumanga.com';
    }
}
*/
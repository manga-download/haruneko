// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MartialManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('martialmanga', `MartialManga`, 'https://martialmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MartialManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'martialmanga';
        super.label = 'MartialManga';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://martialmanga.com';
        this.path = '/manga/list-mode/';
    }
}
*/
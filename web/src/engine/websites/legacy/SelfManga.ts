// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SelfManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('selfmanga', `SelfManga`, 'https://selfmanga.live' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SelfManga extends ReadManga {

    constructor() {
        super();
        super.id = 'selfmanga';
        super.label = 'SelfManga';
        this.tags = [ 'manga', 'russian' ];
        this.url = 'https://selfmanga.ru';
        this.links = {
            login: 'https://grouple.co/internal/auth/login'
        };

        this.preferSubtitleAsMangaTitle = false;
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MintManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mintmanga', `MintManga`, 'https://mintmanga.live' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MintManga extends ReadManga {

    constructor() {
        super();
        super.id = 'mintmanga';
        super.label = 'MintManga';
        this.tags = [ 'manga', 'webtoon', 'russian' ];
        this.url = 'https://mintmanga.live';

        this.preferSubtitleAsMangaTitle = true;
    }
}
*/
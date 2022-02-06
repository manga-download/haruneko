// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BestManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bestmanga', `Best Manga`, 'https://bestmanga.club' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BestManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bestmanga';
        super.label = 'Best Manga';
        this.tags = [ 'manga', 'webtoon', 'russian' ];
        this.url = 'https://bestmanga.club';
    }
}
*/
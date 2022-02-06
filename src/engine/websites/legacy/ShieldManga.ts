// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShieldManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shieldmanga', `Shield Manga`, 'https://shieldmanga.club' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShieldManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'shieldmanga';
        super.label = 'Shield Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://shieldmanga.club';

        this.queryChapters = 'li.wp-manga-chapter > a, li.wp-manga-hapter > a';
        this.queryPages = 'div.page-break source, div.page-beak source';
    }
}
*/
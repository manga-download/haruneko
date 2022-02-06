// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SwordManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('swordmanga', `SwordManga`, 'https://swordmanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SwordManga extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'swordmanga';
        super.label = 'SwordManga';
        this.tags = [ 'manga', 'webtoon', 'novel', 'spanish' ];
        this.url = 'https://swordmanga.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/
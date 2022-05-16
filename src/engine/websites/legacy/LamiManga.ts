// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LamiManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lamimanga', `Lami-Manga`, 'https://lami-manga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LamiManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lamimanga';
        super.label = 'Lami-Manga';
        this.tags = [ 'manga', 'webtoon', 'thai' ];
        this.url = 'https://lami-manga.com';
        this.path = '/manga/list-mode/';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Manhwaland.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaland', `Manhwaland`, 'https://manhwaland.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manhwaland extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwaland';
        super.label = 'Manhwaland';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://manhwaland.org';
        this.path = '/series/list-mode/';
    }

    async _getMangaFromURI(uri) {
        const manga = await super._getMangaFromURI(uri);
        manga.title = manga.title.replace(/^(manga|manhwa|manhua)/i, '').trim();
        return manga;
    }
}
*/
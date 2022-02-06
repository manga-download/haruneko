// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaBoruto.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaboruto', `Manga Boruto`, 'https://sensibleiowans.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaBoruto extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaboruto';
        super.label = 'Manga Boruto';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://sensibleiowans.org';
        this.path = '/manga/list-mode/';
    }
}
*/
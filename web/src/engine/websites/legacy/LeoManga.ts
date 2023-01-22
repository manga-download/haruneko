// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LeoManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leomanga', `LeoManga`, 'https://leomanga.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LeoManga extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'leomanga';
        super.label = 'LeoManga';
        this.tags = [ 'manga', 'spanish' ];
        this.url = 'https://leomanga.me';

        this.queryChapters = 'div.capitulos-list table tr td:first-of-type a';
    }
}
*/
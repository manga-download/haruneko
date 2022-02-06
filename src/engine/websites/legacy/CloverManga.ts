// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CloverManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('clovermanga', `Clover Manga`, 'https://clover-manga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CloverManga extends WordPressMadara {
    constructor() {
        super();
        super.id = 'clovermanga';
        super.label = 'Clover Manga';
        this.tags = [ 'manga', 'high-quality', 'turkish' ];
        this.url = 'https://clover-manga.com';
        this.language = 'tr';
        this.requestOptions.headers.set( 'x-referer', this.url );
    }
}
*/
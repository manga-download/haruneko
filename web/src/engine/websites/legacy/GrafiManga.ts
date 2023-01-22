// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GrafiManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('grafimanga', `GrafiManga`, 'https://grafimanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GrafiManga extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'grafimanga';
        super.label = 'GrafiManga';
        this.tags = [ 'manga', 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://grafimanga.com';

        this.queryChapters = 'div.chapters h3.chapter-title a';
    }
}
*/
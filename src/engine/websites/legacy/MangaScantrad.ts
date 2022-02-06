// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaScantrad.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-scantrad', `Manga-Scantrad`, 'https://manga-scantrad.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaScantrad extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga-scantrad';
        super.label = 'Manga-Scantrad';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://manga-scantrad.net';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LectorManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lectormanga', `LectorManga`, 'https://lectormanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LectorManga extends TuMangaOnline {

    constructor() {
        super();
        super.id = 'lectormanga';
        super.label = 'LectorManga';
        this.tags = [ 'manga', 'spanish' ];
        this.url = 'https://lectormanga.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WestManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('westmanga', `WestManga`, 'https://westmanga.info' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WestManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'westmanga';
        super.label = 'WestManga';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://westmanga.info';
        this.path = '/manga/list-mode/';
    }
}
*/
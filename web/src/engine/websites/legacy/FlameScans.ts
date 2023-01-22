// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FlameScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flamescans', `Flame Scans`, 'https://www.flame-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FlameScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'flamescans';
        super.label = 'Flame Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.flame-scans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
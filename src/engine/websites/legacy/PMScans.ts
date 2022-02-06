// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PMScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pmscans', `PMScans`, 'https://reader.pmscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PMScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'pmscans';
        super.label = 'PMScans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://reader.pmscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
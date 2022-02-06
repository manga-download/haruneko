// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NazarickScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nazarickscans', `Nazarick Scans`, 'https://nazarickscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NazarickScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nazarickscans';
        super.label = 'Nazarick Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://nazarickscans.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './InfernalVoidScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('infernalvoidscans', `InfernalVoidScans`, 'https://infernalvoidscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class InfernalVoidScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'infernalvoidscans';
        super.label = 'InfernalVoidScans';
        this.tags = [ 'webtoon', 'scanlation', 'english' ];
        this.url = 'https://infernalvoidscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
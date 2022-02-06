// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GabutScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gabutscans', `Gabut Scans`, 'https://gabutscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GabutScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gabutscans';
        super.label = 'Gabut Scans';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://gabutscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
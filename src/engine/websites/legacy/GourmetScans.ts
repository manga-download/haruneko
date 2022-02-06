// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GourmetScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gourmetscans', `Gourmet Scans`, 'https://gourmetscans.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GourmetScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gourmetscans';
        super.label = 'Gourmet Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://gourmetscans.net';
    }
}
*/
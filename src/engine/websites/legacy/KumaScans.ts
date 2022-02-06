// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KumaScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumascans', `Kuma Scans`, 'https://kumascans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KumaScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'kumascans';
        super.label = 'Kuma Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://kumascans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
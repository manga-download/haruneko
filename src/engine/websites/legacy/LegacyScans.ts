// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LegacyScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('legacyscans', `Legacy-Scans`, 'https://legacy-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LegacyScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'legacyscans';
        super.label = 'Legacy-Scans';
        this.tags = ['webtoon', 'french'];
        this.url = 'https://legacy-scans.com';
        this.path = '/manga/list-mode/';
    }
}
*/
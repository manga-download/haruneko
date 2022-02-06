// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AceScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('acescans', `Ace Scans`, 'https://acescans.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AceScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'acescans';
        super.label = 'Ace Scans';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://acescans.xyz';
        this.path = '/manga/list-mode/';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SetsuScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('setsuscans', `SetsuScans`, 'https://setsuscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SetsuScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'setsuscans';
        super.label = 'SetsuScans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://setsuscans.com';
    }
}
*/
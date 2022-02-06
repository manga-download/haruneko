// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaZuki.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazuki', `Mangazuki`, 'https://mangazuki.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaZuki extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangazuki';
        super.label = 'Mangazuki';
        this.tags = [ 'manga', 'high-quality', 'english' ];
        this.url = 'https://mangazuki.me';
    }
}
*/
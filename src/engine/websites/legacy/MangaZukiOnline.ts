// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaZukiOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazuki-online', `MangaZukiOnline`, 'https://www.mangazuki.online' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaZukiOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangazuki-online';
        super.label = 'MangaZukiOnline';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.mangazuki.online';
    }
}
*/
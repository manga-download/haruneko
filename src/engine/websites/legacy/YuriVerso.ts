// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YuriVerso.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yuriverso', `Yuri Verso`, 'https://yuri.live' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YuriVerso extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yuriverso';
        super.label = 'Yuri Verso';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://yuri.live';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShonenJumpPlus.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenjumpplus', `少年ジャンプ＋ (Shonen Jump +)`, 'https://shonenjumpplus.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShonenJumpPlus extends CoreView {

    constructor() {
        super();
        super.id = 'shonenjumpplus';
        super.label = '少年ジャンプ＋ (Shonen Jump +)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://shonenjumpplus.com';
    }
}
*/
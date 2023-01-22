// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ImiTui.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imitui', `米推漫画 (ImiTui)`, 'https://www.imitui.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImiTui extends SinMH {

    constructor() {
        super();
        super.id = 'imitui';
        super.label = '米推漫画 (ImiTui)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.imitui.com';
    }
}
*/
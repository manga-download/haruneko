// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FirstKissManhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('1stkissmanhua', `1st Kiss Manhua`, 'https://1stkissmanhua.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FirstKissManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = '1stkissmanhua';
        super.label = '1st Kiss Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://1stkissmanhua.com';
    }
}
*/
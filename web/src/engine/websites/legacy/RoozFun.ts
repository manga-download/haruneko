// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RoozFun.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('roozfun', `腐漫画网 (RoozFun)`, 'https://www.roozfun.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RoozFun extends MH {

    constructor() {
        super();
        super.id = 'roozfun';
        super.label = '腐漫画网 (RoozFun)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.roozfun.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SakuraFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sakurafansub', `Sakura Fansub`, 'https://sakurafansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SakuraFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sakurafansub';
        super.label = 'Sakura Fansub';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://sakurafansub.com';
    }
}
*/
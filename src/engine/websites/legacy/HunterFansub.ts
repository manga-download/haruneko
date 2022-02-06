// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HunterFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hunterfansub', `Hunter Fansub`, 'https://hunterfansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HunterFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hunterfansub';
        super.label = 'Hunter Fansub';
        this.tags = [ 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://hunterfansub.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MoonWitchInLove.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('moonwitchinlove', `Moon Witch In Love`, 'https://moonwitchinlove.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MoonWitchInLove extends WordPressMadara {

    constructor() {
        super();
        super.id = 'moonwitchinlove';
        super.label = 'Moon Witch In Love';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://moonwitchinlove.com';
    }
}
*/
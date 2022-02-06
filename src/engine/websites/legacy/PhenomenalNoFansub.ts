// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PhenomenalNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('phenomenalnofansub', `Phenomenal No Fansub`, 'https://phenomenalnofansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PhenomenalNoFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'phenomenalnofansub';
        super.label = 'Phenomenal No Fansub';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://phenomenalnofansub.com';
    }
}
*/
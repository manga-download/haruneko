// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YokaiJump.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yokaijump', `Yokai Jump`, 'https://yokaijump.fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YokaiJump extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yokaijump';
        super.label = 'Yokai Jump';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://yokaijump.fr';
    }
}
*/
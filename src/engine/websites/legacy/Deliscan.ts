// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Deliscan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('deliscan', `Deliscan`, 'https://deliscan.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Deliscan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'deliscan';
        super.label = 'Deliscan';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://deliscan.xyz';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Hayalistic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hayalistic', `Hayalistic`, 'https://hayalistic.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Hayalistic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hayalistic';
        super.label = 'Hayalistic';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://hayalistic.com';
    }
}
*/
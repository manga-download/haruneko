// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ImmortalUpdates.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('immortalupdates', `Immortal Updates`, 'https://immortalupdates.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImmortalUpdates extends WordPressMadara {

    constructor() {
        super();
        super.id = 'immortalupdates';
        super.label = 'Immortal Updates';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://immortalupdates.com';
    }
}
*/
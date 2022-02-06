// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DarkYueRealm.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkyuerealm', `DarkYue Realm`, 'https://darkyuerealm.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DarkYueRealm extends WordPressMadara {

    constructor() {
        super();
        super.id = 'darkyuerealm';
        super.label = 'DarkYue Realm';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://darkyuerealm.site';
        this.path = '/web';
    }
}
*/
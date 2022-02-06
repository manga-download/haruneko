// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PornComixOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('porncomixonline', `PornComix`, 'https://www.porncomixonline.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PornComixOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'porncomixonline';
        super.label = 'PornComix';
        this.tags = [ 'porn', 'english' ];
        this.url = 'https://www.porncomixonline.net';
    }
}
*/
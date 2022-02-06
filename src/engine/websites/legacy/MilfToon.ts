// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MilfToon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('milftoon', `Milftoon Comics`, 'https://milftoon.xxx' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MilfToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'milftoon';
        super.label = 'Milftoon Comics';
        this.tags = [ 'porn', 'english' ];
        this.url = 'https://milftoon.xxx';
    }
}
*/
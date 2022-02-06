// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './EightMusesXXX.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('8musesxxx', `8 MUSES XXX`, 'https://8muses.xxx' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EightMusesXXX extends WordPressMadara {

    constructor() {
        super();
        super.id = '8musesxxx';
        super.label = '8 MUSES XXX';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://8muses.xxx';
    }
}
*/
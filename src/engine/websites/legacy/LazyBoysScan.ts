// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LazyBoysScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lazyboysscan', `Lazy Boys`, 'https://lazyboysscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LazyBoysScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lazyboysscan';
        super.label = 'Lazy Boys';
        this.tags = [ 'hentai', 'spanish' ];
        this.url = 'https://lazyboysscan.com';
    }
}
*/
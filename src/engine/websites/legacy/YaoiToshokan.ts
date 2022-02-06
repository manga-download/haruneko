// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YaoiToshokan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoitoshokan', `Yaoi Toshokan`, 'https://www.yaoitoshokan.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiToshokan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yaoitoshokan';
        super.label = 'Yaoi Toshokan';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://www.yaoitoshokan.net';
    }
}
*/
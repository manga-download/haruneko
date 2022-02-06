// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YaoiFanClube.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoifanclube', `Yaoi Fan Clube`, 'https://yaoifanclube.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiFanClube extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yaoifanclube';
        super.label = 'Yaoi Fan Clube';
        this.tags = [ 'webtoon', 'hentai', 'portuguese' ];
        this.url = 'https://yaoifanclube.com.br';
    }
}
*/
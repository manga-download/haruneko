// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FusionScanlation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fusionscanlation-hentai', `H Fusion Scanlation`, 'https://h.fusionscanlation.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FusionScanlation extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fusionscanlation-hentai';
        super.label = 'H Fusion Scanlation';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://h.fusionscanlation.com';
    }
}
*/
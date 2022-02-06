// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ThreeQueensScanlator.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('threequeensscanlator', `Three Queens Scanlator`, 'https://tqscan.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ThreeQueensScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'threequeensscanlator';
        super.label = 'Three Queens Scanlator';
        this.tags = [ 'webtoon', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://tqscan.com.br';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GammaPlus.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gammaplus', `GammaPlus`, 'https://gammaplus.takeshobo.co.jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GammaPlus extends TakeShobo {

    constructor() {
        super();
        super.id = 'gammaplus';
        super.label = 'GammaPlus';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://gammaplus.takeshobo.co.jp';
    }
}
*/
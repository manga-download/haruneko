// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AzoraWorld.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('azoraworld', `AzoraWorld`, 'https://azoraworld.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AzoraWorld extends WordPressMadara {

    constructor() {
        super();
        super.id = 'azoraworld';
        super.label = 'AzoraWorld';
        this.tags = [ 'webtoon', 'arabic', 'manga' ];
        this.url = 'https://azoraworld.com';
    }
}
*/
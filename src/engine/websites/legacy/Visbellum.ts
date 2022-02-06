// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Visbellum.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('visbellum', `Visbellum`, 'https://visbellum.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Visbellum extends WordPressMadara {

    constructor() {
        super();
        super.id = 'visbellum';
        super.label = 'Visbellum';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://visbellum.com';
    }
}
*/
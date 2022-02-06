// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GoofFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gooffansub', `Goof Fansub`, 'https://gooffansub.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GoofFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gooffansub';
        super.label = 'Goof Fansub';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://gooffansub.com.br';
    }
}
*/
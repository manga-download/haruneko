// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TeabeerComics.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('teabeercomics', `Teabeer Comics`, 'https://teabeercomics.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TeabeerComics extends WordPressMadara {

    constructor() {
        super();
        super.id = 'teabeercomics';
        super.label = 'Teabeer Comics';
        this.tags = [ 'comic', 'english' ];
        this.url = 'https://teabeercomics.com';
    }
}
*/
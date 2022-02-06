// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaTX.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatx', `Mangatx`, 'https://mangatx.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaTX extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangatx';
        super.label = 'Mangatx';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangatx.com';
    }
}
*/
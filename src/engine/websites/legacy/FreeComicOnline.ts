// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FreeComicOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('freecomiconline', `Free Comic Online`, 'https://freecomiconline.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FreeComicOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'freecomiconline';
        super.label = 'Free Comic Online';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://freecomiconline.me';
    }
}
*/
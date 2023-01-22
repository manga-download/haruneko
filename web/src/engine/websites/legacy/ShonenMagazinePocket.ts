// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShonenMagazinePocket.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenmagazine-pocket', `マガジンポケット (Shonen Magazine Pocket)`, 'https://pocket.shonenmagazine.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShonenMagazinePocket extends CoreView {

    constructor() {
        super();
        super.id = 'shonenmagazine-pocket';
        super.label = 'マガジンポケット (Shonen Magazine Pocket)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://pocket.shonenmagazine.com';

        this.path = [ '/series' ];
        this.queryManga = 'div.series-items ul.daily-series > li.daily-series-item > a';
        this.queryMangaTitle = 'h4.daily-series-title';
    }
}
*/
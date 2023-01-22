// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShonenMagazine.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenmagazine', `週刊少年マガジ (Weekly Shonen Magazine)`, 'https://shonenmagazine.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShonenMagazine extends CoreView {

    constructor() {
        super();
        super.id = 'shonenmagazine';
        super.label = '週刊少年マガジ (Weekly Shonen Magazine)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://shonenmagazine.com';

        this.path = [ '/series/smaga', '/series/bmaga', '/series/others' ];
        this.queryManga = 'article.serial-series-contents ul.serial-series-list > li.serial-series-item > a';
        this.queryMangaTitle = 'h4.series-title';
    }
}
*/
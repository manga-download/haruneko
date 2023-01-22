// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KurageBunch.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuragebunch', `くらげバンチ (KurageBunch)`, 'https://kuragebunch.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KurageBunch extends CoreView {

    constructor() {
        super();
        super.id = 'kuragebunch';
        super.label = 'くらげバンチ (KurageBunch)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://kuragebunch.com';

        this.path = [ '/series/kuragebunch', '/series/comicbunch', '/series/bbunch', '/series/ututu', '/series/oneshot' ];
        this.queryManga = 'ul.page-series-list li.page-series-list-item div.series-data a.series-data-container';
        this.queryMangaTitle = 'h4';
    }
}
*/
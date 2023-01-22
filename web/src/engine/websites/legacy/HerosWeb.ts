// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HerosWeb.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('herosweb', `Hero's (ヒーローズ)`, 'https://viewer.heros-web.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HerosWeb extends CoreView {

    constructor() {
        super();
        super.id = 'herosweb';
        super.label = "Hero's (ヒーローズ)";
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://viewer.heros-web.com';

        this.path = [ '/series/heros', '/series/flat', '/series/wild' ];
        this.queryManga = 'section.series-section ul.series-items > li.series-item > a';
        this.queryMangaTitle = 'h4.item-series-title';
    }
}
*/
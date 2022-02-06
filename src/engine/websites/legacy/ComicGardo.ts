// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicGardo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicgardo', `コミックガルド (Comic Gardo)`, 'https://comic-gardo.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicGardo extends CoreView {

    constructor() {
        super();
        super.id = 'comicgardo';
        super.label = 'コミックガルド (Comic Gardo)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-gardo.com';

        this.path = [ '/series' ];
        this.queryManga = 'div.series ul.series-section-list li.series-section-item a.series-section-item-link';
        this.queryMangaTitle = 'h5.series-title';
    }
}
*/
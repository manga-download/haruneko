// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicAction.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicaction', `webアクション (Comic Action)`, 'https://comic-action.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicAction extends CoreView {

    constructor() {
        super();
        super.id = 'comicaction';
        super.label = 'webアクション (Comic Action)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-action.com';

        this.queryManga = 'section.series ul.series-series-list > li.series-series-item';
        this.queryMangaURI = 'a';
        this.queryMangaTitle = 'h3.series-title';
    }
}
*/
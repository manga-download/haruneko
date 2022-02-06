// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MaID.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('maid', `MAID`, 'https://www.maid.my.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MaID extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'maid';
        super.label = 'MAID';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.maid.my.id';
        this.path = '/manga-list/?list';

        this.querMangaTitleFromURI = 'div.series-title h2';
        this.queryMangas = 'div.mangalist-blc ul li.Manga a.series';
        this.queryChapters = 'div.series-chapter ul.series-chapterlist li div.flexch-infoz a';
        this.queryChaptersTitle = undefined;
        this.queryChaptersTitleBloat = 'span.date';
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }
}
*/
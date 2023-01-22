// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MaID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.maid\.my\.id\/manga\/[^/]+\/$/, 'div.series-title h2')
@MangaStream.MangasSinglePageCSS('div.mangalist-blc ul li.Manga a.series', '/manga-list/?list')
@MangaStream.ChaptersSinglePageCSS('div.series-chapter ul.series-chapterlist li div.flexch-infoz a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('maid', 'MAID', 'https://www.maid.my.id', Tags.Media.Manga, Tags.Language.Indonesian);
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
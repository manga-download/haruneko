// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './LianScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.lianscans\.my\.id\/manga\/[^/]+\/$/, 'div.series-title h2')
@MangaStream.MangasSinglePageCSS('div.mangalist-blc ul li a.series', '/manga-list/')
@MangaStream.ChaptersSinglePageCSS('div.series-chapter ul.series-chapterlist li div.flexch-infoz a', 'span')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lianscans', 'LIAN', 'https://www.lianscans.my.id', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LianScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lianscans';
        super.label = 'LIAN';
        this.tags = [ 'manga', 'indonesian', 'scanlation' ];
        this.url = 'https://www.lianscans.my.id';
        this.path = '/manga-list/';

        this.querMangaTitleFromURI = 'div.series-title h2';
        this.queryMangas = 'div.mangalist-blc ul li a.series';
        this.queryChapters = 'div.series-chapter ul.series-chapterlist li div.flexch-infoz a';
        this.queryChaptersTitle = 'span';
        this.queryChaptersTitleBloat = 'span > span.date';
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }
}
*/
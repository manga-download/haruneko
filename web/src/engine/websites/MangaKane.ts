// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaKane.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangakane\.com\/manga\/[^/]+\/$/, 'div.series-title h2')
@MangaStream.MangasSinglePageCSS('div.mangalist-blc ul li.Manga a.series', '/daftar-komik/')
@MangaStream.ChaptersSinglePageCSS('div.series-chapter ul.series-chapterlist li div.flexch-infoz a', 'span')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakane', 'MangaKane', 'https://mangakane.com', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKane extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangakane';
        super.label = 'MangaKane';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangakane.com';
        this.path = '/daftar-komik/';

        this.querMangaTitleFromURI = 'div.series-title h2';
        this.queryMangas = 'div.mangalist-blc ul li.Manga a.series';
        this.queryChapters = 'div.series-chapter ul.series-chapterlist li div.flexch-infoz a';
        this.queryChaptersTitle = 'span';
        this.queryChaptersTitleBloat = 'span > span.date';
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }

    async _getPages(chapter) {
        const fakeLinkPatterns = [
            /[.,]5\.(jpg|png)$/i,
            /iklan\.(jpg|png)$/i,
            /zz\.(jpg|png)$/i,
            /\.filerun\./i
        ];
        let pageList = await super._getPages(chapter);
        return pageList.filter(link => !fakeLinkPatterns.some(pattern => pattern.test(link)));
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ResetScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/reset-scans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('resetscans', 'Reset Scans', 'https://reset-scans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ResetScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'resetscans';
        super.label = 'Reset Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://reset-scans.com';

        this.bilibili = new BilibiliComics();
        this.queryChapters = 'li.wp-manga-chapter span.chapter-name-before a:last-of-type';
    }

    async _getPages(chapter) {
        if(chapter.id.startsWith(this.bilibili.url)) {
            const bilibiliChapter = { id: new URL(chapter.id).pathname.split('/').pop() };
            return this.bilibili._getPages(bilibiliChapter);
        } else {
            return super._getPages(chapter);
        }
    }
}
*/
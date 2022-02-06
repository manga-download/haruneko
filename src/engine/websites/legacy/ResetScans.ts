// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ResetScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('resetscans', `Reset Scans`, 'https://reset-scans.com' /*, Tags.Language.English, Tags ... */);
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
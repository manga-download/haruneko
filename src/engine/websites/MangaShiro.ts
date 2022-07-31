// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaShiro.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangashiro\.co\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.bxcl ul li span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div#readerarea > :not(.kln) img[src]:not([src=""])')
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangashiro', 'MangaShiro', 'https://mangashiro.co', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaShiro extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangashiro';
        super.label = 'MangaShiro';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangashiro.co';
        this.path = '/manga/?list';

        this.queryChapters = 'div.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div#readerarea > :not(.kln) img[src]:not([src=""])';
    }

    async _getPages(chapter) {
        let pageList = await super._getPages(chapter);
        return pageList.filter(page => !page.endsWith('Last%2Bcover%2Bshironime.png'));
    }
}
*/
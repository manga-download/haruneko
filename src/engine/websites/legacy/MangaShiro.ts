// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaShiro.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangashiro', `MangaShiro`, 'https://mangashiro.co' /*, Tags.Language.English, Tags ... */);
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
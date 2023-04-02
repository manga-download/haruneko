// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaKita.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangakita\.net\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakita', 'MangaKita', 'https://mangakita.net', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKita extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangakita';
        super.label = 'MangaKita';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangakita.net';
        this.path = '/manga/list-mode/';
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
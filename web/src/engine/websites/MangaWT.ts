// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaWT.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.mangawt\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangawt', 'MangaWT', 'https://www.mangawt.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWT extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangawt';
        super.label = 'MangaWT';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://www.mangawt.com';

        this.language = 'tr';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HentaiWebtoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hentaiwebtoon\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaiwebtoon', 'Hentai Webtoon', 'https://hentaiwebtoon.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HentaiWebtoon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentaiwebtoon';
        super.label = 'Hentai Webtoon';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://hentaiwebtoon.com';
    }
}
*/
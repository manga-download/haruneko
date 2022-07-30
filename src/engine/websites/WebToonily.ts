// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WebToonily.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/webtoonily\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoonily', 'WebToonily', 'https://webtoonily.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebToonily extends WordPressMadara {

    constructor() {
        super();
        super.id = 'webtoonily';
        super.label = 'WebToonily';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://webtoonily.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WebtoonTRCOM.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/webtoon-tr\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoontrcom', 'Webtoon TR', 'https://webtoon-tr.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebtoonTRCOM extends WordPressMadara {

    constructor() {
        super();
        super.id = 'webtoontrcom';
        super.label = 'Webtoon TR';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://webtoon-tr.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
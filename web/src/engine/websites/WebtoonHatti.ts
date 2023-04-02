// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WebtoonHatti.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/webtoonhatti\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoonhatti', 'Webtoon Hatti', 'https://webtoonhatti.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebtoonHatti extends WordPressMadara {

    constructor() {
        super();
        super.id = 'webtoonhatti';
        super.label = 'Webtoon Hatti';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://webtoonhatti.com';
    }
}
*/
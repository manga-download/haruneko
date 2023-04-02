// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhuaFast.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhuafast\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuafast', 'Manhuafast', 'https://manhuafast.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaFast extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuafast';
        super.label = 'Manhuafast';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuafast.com';

        this.queryPages = 'figure source, div.page-break source';
    }
}
*/
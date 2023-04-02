// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhuaUs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhuaus\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaus', 'Manhua Us', 'https://manhuaus.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaUs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuaus';
        super.label = 'Manhua Us';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuaus.com';

        this.queryPages = 'div.page-break source, ul.blocks-gallery-grid li.blocks-gallery-item source';
    }
}
*/
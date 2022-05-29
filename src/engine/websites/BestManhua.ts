// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './BestManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/bestmanhua\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bestmanhua', 'Best Manhua', 'https://bestmanhua.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BestManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bestmanhua';
        super.label = 'Best Manhua';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://bestmanhua.com';

        this.queryPages = 'ul.blocks-gallery-grid li.blocks-gallery-item figure source';
    }
}
*/
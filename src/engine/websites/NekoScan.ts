// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NekoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/nekoscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nekoscan', 'NEKOSCAN', 'https://nekoscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NekoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nekoscan';
        super.label = 'NEKOSCAN';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://nekoscan.com';

        this.queryPages = 'div.page-break source, div.text-left p source';
    }
}
*/
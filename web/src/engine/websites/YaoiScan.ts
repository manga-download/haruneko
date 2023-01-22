// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './YaoiScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/yaoiscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoiscan', 'YaoiScan', 'https://yaoiscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yaoiscan';
        super.label = 'YaoiScan';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://yaoiscan.com';
    }
}
*/
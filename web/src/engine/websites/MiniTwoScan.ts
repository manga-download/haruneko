// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MiniTwoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/minitwoscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('minitwoscan', 'MiniTwo Scan', 'https://minitwoscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MiniTwoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'minitwoscan';
        super.label = 'MiniTwo Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://minitwoscan.com';
    }
}
*/
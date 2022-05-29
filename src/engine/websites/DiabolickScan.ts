// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DiabolickScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/diabolickscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('diabolickscan', 'Diabolick Scan', 'https://diabolickscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DiabolickScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'diabolickscan';
        super.label = 'Diabolick Scan';
        this.tags = [ 'webtoon', 'manga', 'portuguese', 'scanlation' ];
        this.url = 'https://diabolickscan.com';
    }
}
*/
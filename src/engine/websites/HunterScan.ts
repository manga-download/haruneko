// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HunterScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.hunterscan\.tk\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hunterscan', 'Hunters Scan', 'https://www.hunterscan.tk'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HunterScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hunterscan';
        super.label = 'Hunters Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://www.hunterscan.tk';
    }
}
*/
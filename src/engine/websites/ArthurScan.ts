// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ArthurScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/arthurscan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arthurscan', 'Arthur Scan', 'https://arthurscan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ArthurScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'arthurscan';
        super.label = 'Arthur Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://arthurscan.xyz';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NekoBreakerScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/nekobreakerscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nekobreakerscan', 'NekoBreaker Scan', 'https://nekobreakerscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NekoBreakerScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nekobreakerscan';
        super.label = 'NekoBreaker Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://nekobreakerscan.com';
    }
}
*/
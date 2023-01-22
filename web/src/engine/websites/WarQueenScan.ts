// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WarQueenScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/wqscan\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('warqueenscan', 'War Queen Scan', 'https://wqscan.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WarQueenScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'warqueenscan';
        super.label = 'War Queen Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://wqscan.com.br';
    }
}
*/
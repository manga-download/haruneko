// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OtakuSekaiScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/otkscanlator\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('otakusekaiscan', 'OtakuSekai Scan', 'https://otkscanlator.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OtakuSekaiScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'otakusekaiscan';
        super.label = 'OtakuSekai Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://otkscanlator.xyz';
    }
}
*/
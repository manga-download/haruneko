// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AncientEmpireScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.ancientempirescan\.website\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ancientempirescan', 'Ancient Empire Scan', 'https://www.ancientempirescan.website'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AncientEmpireScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ancientempirescan';
        super.label = 'Ancient Empire Scan';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://www.ancientempirescan.website';
    }
}
*/
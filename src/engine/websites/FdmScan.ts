// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FdmScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/fdmscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fdmscan', 'Fdm scan', 'https://fdmscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FdmScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fdmscan';
        super.label = 'Fdm scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://fdmscan.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './IsekaiScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/isekaiscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('isekaiscan', 'IsekaiScan', 'https://isekaiscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IsekaiScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'isekaiscan';
        super.label = 'IsekaiScan';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://isekaiscan.com';
    }
}
*/
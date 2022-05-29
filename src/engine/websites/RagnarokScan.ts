// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RagnarokScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ragnarokscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ragnarokscan', 'RagnarokScan', 'https://ragnarokscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RagnarokScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ragnarokscan';
        super.label = 'RagnarokScan';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://ragnarokscan.com';
    }
}
*/
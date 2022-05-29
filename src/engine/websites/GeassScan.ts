// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GeassScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/geassscan\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('geassscan', 'Geass Scan', 'https://geassscan.net/'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GeassScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'geassscan';
        super.label = 'Geass Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://geassscan.net/';
    }
}
*/
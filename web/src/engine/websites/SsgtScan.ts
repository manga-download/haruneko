// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SsgtScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ssgtscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ssgtscan', 'Ssgt Scan', 'https://ssgtscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SsgtScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ssgtscan';
        super.label = 'Ssgt Scan';
        this.tags = [ 'manga', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://ssgtscan.com';
        this.language = 'pt';
    }
}
*/
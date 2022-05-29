// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CronosScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cronosscan\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cronosscan', 'Cronos Scan', 'https://cronosscan.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CronosScan extends WordPressMadara {
    constructor() {
        super();
        super.id = 'cronosscan';
        super.label = 'Cronos Scan';
        this.tags = [ 'manga', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://cronosscan.net';
        this.language = 'pt';
    }
}
*/
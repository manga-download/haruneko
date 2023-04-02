// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OffScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/offscan\.top\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('offscan', 'OFF SCAN', 'https://offscan.top'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OffScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'offscan';
        super.label = 'OFF SCAN';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://offscan.top';
    }
}
*/
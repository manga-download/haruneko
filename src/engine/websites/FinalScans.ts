// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FinalScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/finalscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('finalscans', 'Final Scans', 'https://finalscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FinalScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'finalscans';
        super.label = 'Final Scans';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://finalscans.com';
    }
}
*/
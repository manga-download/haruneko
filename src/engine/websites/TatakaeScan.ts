// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TatakaeScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tatakaescan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tatakaescan', 'Tatakae Scan', 'https://tatakaescan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TatakaeScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tatakaescan';
        super.label = 'Tatakae Scan';
        this.tags = [ 'webtoon', 'manga', 'portuguese', 'scanlation' ];
        this.url = 'https://tatakaescan.xyz';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SinensisScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sinensisscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sinensisscan', 'Sinenis Scan', 'https://sinensisscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SinensisScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sinensisscan';
        super.label = 'Sinenis Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://sinensisscan.com';
    }
}
*/
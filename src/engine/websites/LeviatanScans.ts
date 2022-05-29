// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LeviatanScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/leviatanscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leviatanscans', 'LeviatanScans', 'https://leviatanscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LeviatanScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'leviatanscans';
        super.label = 'LeviatanScans';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://leviatanscans.com';
    }
}
*/
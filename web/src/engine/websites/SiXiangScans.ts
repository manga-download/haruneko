// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SiXiangScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.sixiangscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sixiangscans', 'SiXiang Scans', 'http://www.sixiangscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SiXiangScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sixiangscans';
        super.label = 'SiXiang Scans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://www.sixiangscans.com';
    }
}
*/
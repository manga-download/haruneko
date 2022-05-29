// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HappyTeaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/happyteascans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('happyteascans', 'Happy Tea Scans', 'https://happyteascans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HappyTeaScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'happyteascans';
        super.label = 'Happy Tea Scans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://happyteascans.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SKScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/skscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('skscans', 'SK Scans (Sleeping Knight)', 'https://skscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SKScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'skscans';
        super.label = 'SK Scans (Sleeping Knight)';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://skscans.com';
    }
}
*/
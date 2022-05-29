// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DisasterScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/disasterscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('disasterscans', 'Disaster Scans', 'https://disasterscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DisasterScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'disasterscans';
        super.label = 'Disaster Scans';
        this.tags = [ 'webtoon', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://disasterscans.com';

        this.queryMangas = 'div.post-title h3 a:last-of-type, div.post-title h5 a:last-of-type';
    }
}
*/
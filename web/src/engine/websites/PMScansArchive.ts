// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PMScansArchive.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.pmscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pmscans-archive', 'PMScans (Archive)', 'https://www.pmscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PMScansArchive extends WordPressMadara {

    constructor() {
        super();
        super.id = 'pmscans-archive';
        super.label = 'PMScans (Archive)';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.pmscans.com';
    }
}
*/
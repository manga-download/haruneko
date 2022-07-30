// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PlatinumScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/platinumscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('platinumscans', 'PlatinumScans', 'https://platinumscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PlatinumScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'platinumscans';
        super.label = 'PlatinumScans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://platinumscans.com';
    }
}
*/
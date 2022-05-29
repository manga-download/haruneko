// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LeviatanScansES.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/es\.leviatanscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leviatanscans-es', 'LeviatanScans (Spanish)', 'https://es.leviatanscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LeviatanScansES extends WordPressMadara {

    constructor() {
        super();
        super.id = 'leviatanscans-es';
        super.label = 'LeviatanScans (Spanish)';
        this.tags = [ 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://es.leviatanscans.com';
    }
}
*/
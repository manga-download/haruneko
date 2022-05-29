// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ShimadaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/shimadascans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shimadascans', 'Shimadascans', 'https://shimadascans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShimadaScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'shimadascans';
        super.label = 'Shimadascans';
        this.tags = [ 'webtoon', 'english', 'scanlation' ];
        this.url = 'https://shimadascans.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
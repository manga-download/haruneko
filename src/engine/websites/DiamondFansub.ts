// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DiamondFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/diamondfansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('diamondfansub', 'DiamondFansub', 'https://diamondfansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DiamondFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'diamondfansub';
        super.label = 'DiamondFansub';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://diamondfansub.com';
    }
}
*/
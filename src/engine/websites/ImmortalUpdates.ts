// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ImmortalUpdates.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/immortalupdates\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('immortalupdates', 'Immortal Updates', 'https://immortalupdates.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImmortalUpdates extends WordPressMadara {

    constructor() {
        super();
        super.id = 'immortalupdates';
        super.label = 'Immortal Updates';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://immortalupdates.com';
    }
}
*/
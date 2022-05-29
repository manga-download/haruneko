// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DragonTea.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/dragontea\.ink\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dragontea', 'Dragon Tea Scans', 'https://dragontea.ink'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DragonTea extends WordPressMadara {

    constructor() {
        super();
        super.id = 'dragontea';
        super.label = 'Dragon Tea Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://dragontea.ink';
    }
}
*/
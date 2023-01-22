// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Mangaboss.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaboss\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaboss', 'Mangaboss', 'https://mangaboss.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangaboss extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaboss';
        super.label = 'Mangaboss';
        this.tags = [ 'manga', 'english', 'webtoon' ];
        this.url = 'https://mangaboss.org';
    }
}
*/
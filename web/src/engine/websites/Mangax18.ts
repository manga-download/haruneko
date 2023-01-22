// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Mangax18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangax18\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangax18', 'Mangax18', 'https://mangax18.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangax18 extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangax18';
        super.label = 'Mangax18';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangax18.com';
    }
}
*/
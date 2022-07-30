// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Mangabaz.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangabaz\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabaz', 'Mangabaz', 'https://mangabaz.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangabaz extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangabaz';
        super.label = 'Mangabaz';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://mangabaz.com';
    }
}
*/
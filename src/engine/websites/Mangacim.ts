// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Mangacim.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.mangacim\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacim', 'Mangacim', 'https://www.mangacim.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangacim extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangacim';
        super.label = 'Mangacim';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.mangacim.com';
    }
}
*/
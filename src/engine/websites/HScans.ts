// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hscans', 'HSCANS', 'https://hscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hscans';
        super.label = 'HSCANS';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://hscans.com';
    }
}
*/
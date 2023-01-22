// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MarkScansHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mhentais\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('markscanshentai', 'Mark Scans Hentai', 'https://mhentais.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MarkScansHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'markscanshentai';
        super.label = 'Mark Scans Hentai';
        this.tags = [ 'webtoon', 'portuguese', 'hentai' ];
        this.url = 'https://mhentais.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GloryScansHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hentai\.gloryscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gloryscanshentai', 'Glory Scans Hentai', 'https://hentai.gloryscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GloryScansHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gloryscanshentai';
        super.label = 'Glory Scans Hentai';
        this.tags = [ 'hentai', 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://hentai.gloryscan.com';
    }
}
*/
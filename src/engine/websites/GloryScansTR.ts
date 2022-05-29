// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GloryScansTR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/gloryscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('glory-scans', 'Glory-Scans', 'https://gloryscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GloryScansTR extends WordPressMadara {

    constructor() {
        super();
        super.id = 'glory-scans';
        super.label = 'Glory-Scans';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://gloryscans.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
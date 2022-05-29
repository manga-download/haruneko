// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CizgiRomanArsivi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cizgiromanarsivi\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cizgiromanarsivi', 'Çizgi Roman Arşivi (CizgiRomanArsivi)', 'https://cizgiromanarsivi.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CizgiRomanArsivi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cizgiromanarsivi';
        super.label = 'Çizgi Roman Arşivi (CizgiRomanArsivi)';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://cizgiromanarsivi.com';
    }
}
*/
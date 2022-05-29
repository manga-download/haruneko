// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CeriseScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cerisescans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cerisescans', 'Cerise Scans', 'https://cerisescans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CeriseScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cerisescans';
        super.label = 'Cerise Scans';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://cerisescans.com';
    }
}
*/
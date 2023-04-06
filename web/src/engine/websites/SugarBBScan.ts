// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SugarBBScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sugarbbscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sugarbbscan', 'Sugar Babies Scans', 'https://sugarbbscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SugarBBScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sugarbbscan';
        super.label = 'Sugar Babies Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://sugarbbscan.com';
    }
}
*/
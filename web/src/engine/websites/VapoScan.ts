// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './VapoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/vaposcan\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vaposcan', 'Vapo Scan', 'https://vaposcan.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class VapoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'vaposcan';
        super.label = 'Vapo Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://vaposcan.net';
    }
}
*/
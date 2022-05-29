// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './YaoiToshokan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.yaoitoshokan\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoitoshokan', 'Yaoi Toshokan', 'https://www.yaoitoshokan.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiToshokan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yaoitoshokan';
        super.label = 'Yaoi Toshokan';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://www.yaoitoshokan.net';
    }
}
*/
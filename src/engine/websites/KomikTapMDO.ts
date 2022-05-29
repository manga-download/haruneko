// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './KomikTapMDO.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwa\.komiktap\.co\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiktap-mdo', 'KomikTap (MDO)', 'https://manhwa.komiktap.co'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikTapMDO extends WordPressMadara {

    constructor() {
        super();
        super.id = 'komiktap-mdo';
        super.label = 'KomikTap (MDO)';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://manhwa.komiktap.co';

        this.queryTitleForURI = 'div.post-title h1';
    }
}
*/
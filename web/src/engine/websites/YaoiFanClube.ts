// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './YaoiFanClube.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/yaoifanclube\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoifanclube', 'Yaoi Fan Clube', 'https://yaoifanclube.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiFanClube extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yaoifanclube';
        super.label = 'Yaoi Fan Clube';
        this.tags = [ 'webtoon', 'hentai', 'portuguese' ];
        this.url = 'https://yaoifanclube.com.br';
    }
}
*/
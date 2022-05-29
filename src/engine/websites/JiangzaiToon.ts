// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './JiangzaiToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/jiangzaitoon\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jiangzaitoon', 'Jiangzaitoon', 'https://jiangzaitoon.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JiangzaiToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'jiangzaitoon';
        super.label = 'Jiangzaitoon';
        this.tags = [ 'webtoon', 'hentai', 'turkish' ];
        this.url = 'https://jiangzaitoon.org';
    }
}
*/
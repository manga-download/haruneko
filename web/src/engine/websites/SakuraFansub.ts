// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SakuraFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sakurafansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sakurafansub', 'Sakura Fansub', 'https://sakurafansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SakuraFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sakurafansub';
        super.label = 'Sakura Fansub';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://sakurafansub.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './KnightNoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/knightnoscanlation\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('knightnofansub', 'Knight no Fansub', 'https://knightnoscanlation.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KnightNoFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'knightnofansub';
        super.label = 'Knight no Fansub';
        this.tags = [ 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://knightnoscanlation.com';
    }
}
*/
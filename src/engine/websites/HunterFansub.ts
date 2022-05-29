// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HunterFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hunterfansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hunterfansub', 'Hunter Fansub', 'https://hunterfansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HunterFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hunterfansub';
        super.label = 'Hunter Fansub';
        this.tags = [ 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://hunterfansub.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WonderlandWebtoons.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/landwebtoons\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wonderlandwebtoons', 'Wonderland - Land Webtoons', 'https://landwebtoons.site'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WonderlandWebtoons extends WordPressMadara {

    constructor() {
        super();
        super.id = 'wonderlandwebtoons';
        super.label = 'Wonderland - Land Webtoons';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://landwebtoons.site';
    }
}
*/
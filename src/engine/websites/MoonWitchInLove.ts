// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MoonWitchInLove.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/moonwitchinlove\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('moonwitchinlove', 'Moon Witch In Love', 'https://moonwitchinlove.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MoonWitchInLove extends WordPressMadara {

    constructor() {
        super();
        super.id = 'moonwitchinlove';
        super.label = 'Moon Witch In Love';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://moonwitchinlove.com';
    }
}
*/
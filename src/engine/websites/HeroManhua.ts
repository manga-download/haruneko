// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HeroManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/levelerscans\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('heromanhua', 'HeroManhua ✕ Leveler', 'https://levelerscans.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HeroManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'heromanhua';
        super.label = 'HeroManhua ✕ Leveler';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://levelerscans.xyz';
    }
}
*/
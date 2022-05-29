// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ApollToons.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/apolltoons\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('apolltoons', 'Apolltoons', 'https://apolltoons.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ApollToons extends WordPressMadara {

    constructor() {
        super();
        super.id = 'apolltoons';
        super.label = 'Apolltoons';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://apolltoons.xyz';
    }
}
*/
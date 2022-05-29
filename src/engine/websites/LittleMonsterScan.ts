// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LittleMonsterScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/littlemonsterscan\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('littlemonsterscan', 'Little Monster Scan', 'https://littlemonsterscan.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LittleMonsterScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'littlemonsterscan';
        super.label = 'Little Monster Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://littlemonsterscan.com.br';
    }
}
*/
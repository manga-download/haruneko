// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RandomScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/randomscan\.online\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('randomscan', 'Random Scan', 'https://randomscan.online'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RandomScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'randomscan';
        super.label = 'Random Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://randomscan.online';
    }
}
*/
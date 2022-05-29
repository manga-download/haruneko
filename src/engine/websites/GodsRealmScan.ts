// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GodsRealmScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/godsrealmscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('godsrealmscan', `God's Realm Scan`, 'https://godsrealmscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GodsRealmScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'godsrealmscan';
        super.label = 'God\'s Realm Scan';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://godsrealmscan.com';
    }
}
*/
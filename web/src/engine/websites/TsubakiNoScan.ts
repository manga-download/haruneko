// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TsubakiNoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tsubakinoscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tsubakinoscan', 'Tsubaki No Scan', 'https://tsubakinoscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TsubakiNoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tsubakinoscan';
        super.label = 'Tsubaki No Scan';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://tsubakinoscan.com';
    }
}
*/
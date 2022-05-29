// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FenixScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga-fenix\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fenixscan', 'Manga Fenix', 'https://manga-fenix.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FenixScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'fenixscan';
        super.label = 'Manga Fenix';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://manga-fenix.com';
    }
}
*/
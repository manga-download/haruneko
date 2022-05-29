// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AquaManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/aquamanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('aquamanga', 'AquaManga', 'https://aquamanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AquaManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'aquamanga';
        super.label = 'AquaManga';
        this.tags = [ 'manga', 'english', 'webtoon' ];
        this.url = 'https://aquamanga.com';
    }
}
*/
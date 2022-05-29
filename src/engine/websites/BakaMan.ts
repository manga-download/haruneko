// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './BakaMan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/bakaman\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bakaman', 'BAKAMAN', 'https://bakaman.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BakaMan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bakaman';
        super.label = 'BAKAMAN';
        this.tags = [ 'manga', 'webtoon', 'thai' ];
        this.url = 'https://bakaman.net';
    }
}
*/
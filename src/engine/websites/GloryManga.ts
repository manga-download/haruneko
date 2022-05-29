// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GloryManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/glorymanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('glorymanga', 'GloryManga', 'https://glorymanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GloryManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'glorymanga';
        super.label = 'GloryManga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://glorymanga.com';
    }
}
*/
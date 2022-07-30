// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ZManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/zmanga\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zmanga', 'ZMANGA', 'https://zmanga.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ZManga extends WordPressMadara {
//dead?
    constructor() {
        super();
        super.id = 'zmanga';
        super.label = 'ZMANGA';
        this.tags = [ 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://zmanga.org';
    }
}
*/
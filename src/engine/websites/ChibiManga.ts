// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ChibiManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.cmreader\.info\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('chibimanga', 'ChibiManga', 'https://www.cmreader.info'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ChibiManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'chibimanga';
        super.label = 'ChibiManga';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://www.cmreader.info';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './YoManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/yomanga\.info\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yomanga', 'YoManga', 'https://yomanga.info'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YoManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yomanga';
        super.label = 'YoManga';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://yomanga.info';
    }
}
*/
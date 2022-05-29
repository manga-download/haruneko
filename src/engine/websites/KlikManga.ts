// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './KlikManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/klikmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klikmanga', 'KlikManga', 'https://klikmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KlikManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'klikmanga';
        super.label = 'KlikManga';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://klikmanga.com';
    }
}
*/
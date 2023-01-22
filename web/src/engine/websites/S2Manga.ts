// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './S2Manga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/s2manga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('s2manga', 'S2Manga', 'https://s2manga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class S2Manga extends WordPressMadara {

    constructor() {
        super();
        super.id = 's2manga';
        super.label = 'S2Manga';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://s2manga.com';
    }
}
*/
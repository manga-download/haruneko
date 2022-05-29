// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './BestManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/bestmanga\.club\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bestmanga', 'Best Manga', 'https://bestmanga.club'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BestManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bestmanga';
        super.label = 'Best Manga';
        this.tags = [ 'manga', 'webtoon', 'russian' ];
        this.url = 'https://bestmanga.club';
    }
}
*/
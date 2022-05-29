// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FreeManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/freemanga\.me\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('freemanga', 'Free Manga', 'https://freemanga.me/'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FreeManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'freemanga';
        super.label = 'Free Manga';
        this.tags = ['webtoon', 'english', 'manga'];
        this.url = 'https://freemanga.me/';
    }
}
*/
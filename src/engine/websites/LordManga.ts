// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LordManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/lordmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lordmanga', 'Lord Manga', 'https://lordmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LordManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lordmanga';
        super.label = 'Lord Manga';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://lordmanga.com';
    }
}
*/
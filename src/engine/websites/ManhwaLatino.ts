// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhwaLatino.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwa-latino\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwalatino', 'Manhwa-Latino', 'https://manhwa-latino.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaLatino extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwalatino';
        super.label = 'Manhwa-Latino';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://manhwa-latino.com';
    }
}
*/
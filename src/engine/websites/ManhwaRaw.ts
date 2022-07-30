// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhwaRaw.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwaraw\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaraw', 'Manhwa Raw', 'https://manhwaraw.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaRaw extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwaraw';
        super.label = 'Manhwa Raw';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://manhwaraw.com';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Hentai3z.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hentai3z\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentai3z', 'Hentai3z', 'https://hentai3z.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Hentai3z extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentai3z';
        super.label = 'Hentai3z';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'english' ];
        this.url = 'https://hentai3z.com';

        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Hentaidexy.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hentaidexy\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaidexy', 'Hentaidexy', 'https://hentaidexy.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Hentaidexy extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hentaidexy';
        super.label = 'Hentaidexy';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://hentaidexy.com';
    }
}
*/
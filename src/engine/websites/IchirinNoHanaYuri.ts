// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './IchirinNoHanaYuri.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ichirinnohanayuriscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ichirinnohanayuri', 'Ichirin No Hana Yuri', 'https://ichirinnohanayuriscan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IchirinNoHanaYuri extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ichirinnohanayuri';
        super.label = 'Ichirin No Hana Yuri';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://ichirinnohanayuriscan.com';
        this.queryMangas = 'div.post-title.font-title h4 a';
        this.queryChapters = 'li.wp-manga-chapter a';
    }
}
*/
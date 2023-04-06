// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaLandArabic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangalandarabic\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalandarabic', 'مانجا لاند عربي (Manga Land Arabic)', 'https://mangalandarabic.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLandArabic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangalandarabic';
        super.label = 'مانجا لاند عربي (Manga Land Arabic)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://mangalandarabic.com';
    }
}
*/
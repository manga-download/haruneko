// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaArchive.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaarabonline\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaarchive', 'مانجا عرب اون لاين (Manga Archive)', 'https://mangaarabonline.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaArchive extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaarchive';
        super.label = 'مانجا عرب اون لاين (Manga Archive)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://mangaarabonline.com';
    }
}
*/
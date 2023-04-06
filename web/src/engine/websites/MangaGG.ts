// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaGG.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangagg\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagg', 'MangaGG', 'https://mangagg.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGG extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangagg';
        super.label = 'MangaGG';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangagg.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
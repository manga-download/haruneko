// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaGreat.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangagreat\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagreat', 'MANGAGREAT', 'https://mangagreat.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaGreat extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangagreat';
        super.label = 'MANGAGREAT';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangagreat.com';

        this.queryPages = 'div.read-container source';
    }
}
*/
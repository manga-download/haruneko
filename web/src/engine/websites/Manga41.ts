// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Manga41.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga41\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga41', 'Manga 41', 'https://manga41.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga41 extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga41';
        super.label = 'Manga 41';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manga41.com';
    }
}
*/
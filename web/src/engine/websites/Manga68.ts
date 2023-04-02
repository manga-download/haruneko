// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Manga68.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga68\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga68', 'Manga68', 'https://manga68.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga68 extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manga68';
        super.label = 'Manga68';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manga68.com';
    }
}
*/
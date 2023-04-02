// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Manga365.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/365manga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('365manga', '365Manga', 'https://365manga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manga365 extends WordPressMadara {

    constructor() {
        super();
        super.id = '365manga';
        super.label = '365Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://365manga.com';
    }
}
*/
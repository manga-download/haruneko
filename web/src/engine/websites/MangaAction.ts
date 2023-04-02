// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaAction.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaaction\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaaction', 'مانجا اكشن (Manga Action)', 'https://mangaaction.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaAction extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaaction';
        super.label = 'مانجا اكشن (Manga Action)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaaction.com';
    }
}
*/
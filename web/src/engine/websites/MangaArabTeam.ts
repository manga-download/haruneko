// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaArabTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaarabteam\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaarabteam', 'مانجا عرب تيم (Manga Arab Team)', 'https://mangaarabteam.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaArabTeam extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaarabteam';
        super.label = 'مانجا عرب تيم (Manga Arab Team)';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://mangaarabteam.com';
    }
}
*/
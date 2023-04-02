// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaReadCO.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaread\.co\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangareadco', 'Manga Read', 'https://mangaread.co'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaReadCO extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangareadco';
        super.label = 'Manga Read';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://mangaread.co';
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaWeebs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaweebs\.in\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaweebs', 'Manga Weebs', 'https://mangaweebs.in'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaWeebs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaweebs';
        super.label = 'Manga Weebs';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://mangaweebs.in';
    }
}
*/
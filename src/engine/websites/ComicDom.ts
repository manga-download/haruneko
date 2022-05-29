// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ComicDom.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/comicdom\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicdom', 'ComicDom', 'https://comicdom.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicDom extends WordPressMadara {

    constructor() {
        super();
        super.id = 'comicdom';
        super.label = 'ComicDom';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://comicdom.org';

        this.queryMangas = 'div.post-title h3 a:last-of-type';
    }
}
*/
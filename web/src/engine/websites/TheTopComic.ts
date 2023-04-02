// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TheTopComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/thetopcomic\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thetopcomic', 'The Top Comic', 'https://thetopcomic.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TheTopComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'thetopcomic';
        super.label = 'The Top Comic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://thetopcomic.com';
    }
}
*/
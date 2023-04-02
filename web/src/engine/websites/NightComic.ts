// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NightComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.nightcomic\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nightcomic', 'NIGHT COMIC', 'https://www.nightcomic.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NightComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nightcomic';
        super.label = 'NIGHT COMIC';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.nightcomic.com';
    }
}
*/
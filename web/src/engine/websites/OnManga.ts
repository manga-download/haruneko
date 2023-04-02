// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OnManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/onmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('onmanga', 'On Manga', 'https://onmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OnManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'onmanga';
        super.label = 'On Manga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://onmanga.com';
    }
}
*/
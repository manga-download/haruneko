// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManyToonCOM.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manytoon\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manytooncom', 'ManyToon', 'https://manytoon.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManyToonCOM extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manytooncom';
        super.label = 'ManyToon';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'english' ];
        this.url = 'https://manytoon.com';
    }
}
*/
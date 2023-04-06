// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManyToonKR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manytoon\.club\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manytoonkr', 'ManyToonKR', 'https://manytoon.club'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManyToonKR extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manytoonkr';
        super.label = 'ManyToonKR';
        this.tags = [ 'webtoon', 'hentai', 'raw', 'korean' ];
        this.url = 'https://manytoon.club';
    }
}
*/
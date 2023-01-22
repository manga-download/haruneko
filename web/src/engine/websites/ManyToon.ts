// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManyToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manytoon\.me\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manytoon', 'ManyToon', 'https://manytoon.me'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManyToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manytoon';
        super.label = 'ManyToon';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://manytoon.me'; // Miror?: https://manytoon.com
    }
}
*/
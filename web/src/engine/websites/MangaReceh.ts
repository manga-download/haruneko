// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaReceh.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangceh\.me\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangareceh', 'MANGCEH', 'https://mangceh.me'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaReceh extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangareceh';
        super.label = 'MANGCEH';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://mangceh.me';

        this.queryChapters = 'li.wp-manga-chapter > a:first-of-type';
    }
}
*/
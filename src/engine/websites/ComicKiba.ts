// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ComicKiba.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/comickiba\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comickiba', 'Comic Kiba', 'https://comickiba.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicKiba extends WordPressMadara {

    constructor() {
        super();
        super.id = 'comickiba';
        super.label = 'Comic Kiba';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://comickiba.com';

        this.queryPages = 'div.page-break source, li.blocks-gallery-item source';
    }
}
*/
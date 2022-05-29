// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Aloalivn.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/aloalivn\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('aloalivn', 'Aloalivn', 'https://aloalivn.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Aloalivn extends WordPressMadara {

    constructor() {
        super();
        super.id = 'aloalivn';
        super.label = 'Aloalivn';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://aloalivn.com';
        this.queryPages = 'li.blocks-gallery-item source';
    }
}
*/
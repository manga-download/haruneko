// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TheGuildScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/theguildscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('theguildscans', 'The Guild Scans', 'https://theguildscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TheGuildScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'theguildscans';
        super.label = 'The Guild Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://theguildscans.com';
    }
}
*/
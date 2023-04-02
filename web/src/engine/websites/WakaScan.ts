// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WakaScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/wakascan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wakascan', 'WAKASCAN', 'https://wakascan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WakaScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'wakascan';
        super.label = 'WAKASCAN';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://wakascan.com';
    }
}
*/
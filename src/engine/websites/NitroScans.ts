// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NitroScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/nitroscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nitroscans', 'Nitro Scans', 'https://nitroscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NitroScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nitroscans';
        super.label = 'Nitro Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://nitroscans.com';
    }
}
*/
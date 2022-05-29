// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AnubisScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/anubisscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anubisscans', 'Anubis Scans', 'https://anubisscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AnubisScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anubisscans';
        super.label = 'Anubis Scans';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://anubisscans.com';
    }
}
*/
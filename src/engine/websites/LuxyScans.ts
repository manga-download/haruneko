// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LuxyScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/luxyscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('luxyscans', 'LuxyScans', 'https://luxyscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LuxyScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'luxyscans';
        super.label = 'LuxyScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://luxyscans.com';
    }
}
*/
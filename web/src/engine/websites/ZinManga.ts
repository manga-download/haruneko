// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ZinManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/new\.renascans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('renascencescans', 'RenascenceScans', 'https://new.renascans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ZinManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'renascencescans';
        super.label = 'RenascenceScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://new.renascans.com';
    }
}
*/
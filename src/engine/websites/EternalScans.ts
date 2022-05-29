// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './EternalScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/eternalscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eternalscans', 'Eternal Scans', 'https://eternalscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EternalScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'eternalscans';
        super.label = 'Eternal Scans';
        this.tags = [ 'manga', 'english', 'webtoon', 'scanlation' ];
        this.url = 'https://eternalscans.com';
    }
}
*/
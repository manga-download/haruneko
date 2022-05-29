// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LimaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/limascans\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('limascans', 'Lima Scans', 'http://limascans.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LimaScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'limascans';
        super.label = 'Lima Scans';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'http://limascans.xyz';
        this.path = '/v2';
    }
}
*/
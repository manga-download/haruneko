// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SKSubs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sksubs\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sksubs', 'Seven King Scanlation', 'https://sksubs.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SKSubs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sksubs';
        super.label = 'Seven King Scanlation';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://sksubs.net';
    }
}
*/
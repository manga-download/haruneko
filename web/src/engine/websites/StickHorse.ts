// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './StickHorse.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.stickhorse\.cl\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('stickhorse', 'Stick Horse', 'https://www.stickhorse.cl'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class StickHorse extends WordPressMadara {

    constructor() {
        super();
        super.id = 'stickhorse';
        super.label = 'Stick Horse';
        this.tags = [ 'manga', 'webtoon', 'comic', 'spanish' ];
        this.url = 'https://www.stickhorse.cl';
    }
}
*/
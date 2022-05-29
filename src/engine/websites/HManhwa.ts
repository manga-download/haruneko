// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hmanhwa\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hmanhwa', 'HManhwa', 'https://hmanhwa.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HManhwa extends WordPressMadara {
    constructor() {
        super();
        super.id = 'hmanhwa';
        super.label = 'HManhwa';
        this.tags = [ 'webtoon', 'hentai', 'english', 'korean' ];
        this.url = 'https://hmanhwa.com';
    }
}
*/
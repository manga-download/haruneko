// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TopComicPorno.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/topcomicporno\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('topcomicporno', 'Top Comic Porno', 'https://topcomicporno.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TopComicPorno extends WordPressMadara {

    constructor() {
        super();
        super.id = 'topcomicporno';
        super.label = 'Top Comic Porno';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://topcomicporno.com';
    }
}
*/
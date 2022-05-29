// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './BetaFox.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.betafox\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('betafox', 'Beta Fox', 'https://www.betafox.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BetaFox extends WordPressMadara {

    constructor() {
        super();
        super.id = 'betafox';
        super.label = 'Beta Fox';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'english' ];
        this.url = 'https://www.betafox.net';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/
// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LatestManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/latestmanga\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('topmanhuanet', 'LatestManga', 'https://latestmanga.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LatestManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'topmanhuanet';
        super.label = 'LatestManga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://latestmanga.net';
    }
}
*/
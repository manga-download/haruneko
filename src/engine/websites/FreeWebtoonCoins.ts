// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './FreeWebtoonCoins.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/freewebtooncoins\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('freewebtooncoins', 'Free Webtoon Coins', 'https://freewebtooncoins.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FreeWebtoonCoins extends WordPressMadara {

    constructor() {
        super();
        super.id = 'freewebtooncoins';
        super.label = 'Free Webtoon Coins';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://freewebtooncoins.com';
    }
}
*/
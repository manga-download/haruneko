import { Tags } from '../Tags';
import icon from './FreeWebtoonCoins.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/freewebtooncoins\.com\/webtoon\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="free coins"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('freewebtooncoins', 'Free Webtoon Coins', 'https://freewebtooncoins.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
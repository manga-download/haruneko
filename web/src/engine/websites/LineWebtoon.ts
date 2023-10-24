import { Tags } from '../Tags';
import icon from './LineWebtoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as LineW from './decorators/LineWebtoon';

@LineW.MangaCSS(/^https?:\/\/www\.webtoons\.com\/[a-z]{2}\/[^/]+\/[^/]+\/list\?title_no=\d+$/)
@Common.MangasNotSupported()
@LineW.ChaptersMultiPageCSS()
@LineW.PagesSinglePageJS()
@LineW.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon', `Line Webtoon`, 'https://www.webtoons.com/', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }
}

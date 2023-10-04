import { Tags } from '../Tags';
import icon from './LineWebtoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as LineW from './decorators/LineWebtoon';

@Common.MangaCSS(/^https?:\/\/www\.webtoons\.com\/\S+\/\S+\/\S+\/list\?title_no=\d+$/, LineW.queryMangaTitleURI, Common.ElementLabelExtractor(), true)
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

import { Tags } from '../Tags';
import icon from './Doujin69.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/doujin69\.com\/doujin\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/doujin/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujin69', 'Doujin69', 'https://doujin69.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
import { Tags } from '../Tags';
import icon from './MangaEighteenUS.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhuascan\.us\/manga\/[^/]+$/)
@Common.MangasMultiPageCSS('div.bs div.bsx div.bigor > a', Common.PatternLinkGenerator('/manga-list?page={page}'))
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga18-us', 'Manhuascan.us (Manga18.us)', 'https://manhuascan.us', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
import { Tags } from '../Tags';
import icon from './ManhwaClub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwahentai\.to\/pornhwa\/[^/]+\/$/, 'div#manga-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaclub', 'ManhwaHentai', 'https://manhwahentai.to', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
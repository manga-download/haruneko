import { Tags } from '../Tags';
import icon from './ManhwaHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/pornhwa\/[^/]+\/$/, 'div#manga-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwahentai', 'ManhwaHentai', 'https://manhwahentai.to', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
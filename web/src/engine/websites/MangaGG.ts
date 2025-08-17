import { Tags } from '../Tags';
import icon from './MangaGG.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/comic\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagg', 'MangaGG', 'https://mangagg.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
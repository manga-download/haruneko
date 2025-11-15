import { Tags } from '../Tags';
import icon from './MangaForFree.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaforfree', 'MangaForFree', 'https://mangaforfree.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
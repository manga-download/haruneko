import { Tags } from '../Tags';
import icon from './MangaOku.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/seri\/[^/]+\/$/, 'div.post-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaoku', 'MangaOku', 'https://mangaoku.info', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
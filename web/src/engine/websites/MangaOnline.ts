import { Tags } from '../Tags';
import icon from './MangaOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.sheader  div.data h1')
@Common.MangasMultiPageCSS('/manga/page/{page}/', 'article div.data h3 a')
@Common.ChaptersSinglePageCSS('ul.episodios li div.episodiotitle a', Common.AnchorInfoExtractor(false, 'span'))
@Common.PagesSinglePageCSS('div.content p img[loading]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaonline', 'Manga Online', 'https://mangaonline.biz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}
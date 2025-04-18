import { Tags } from '../Tags';
import icon from './MangaNeed.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comic-\d+\/index\.html$/, 'h3 a.link')
@Common.MangasMultiPageCSS('/category/page/{page}/', 'div.grid a.link-pri')
@Common.ChaptersSinglePageCSS('div.scrollable-panel a')
@Common.PagesSinglePageCSS('p.chapterpic img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganeed', 'MangaNeed', 'https://www.manganeed.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
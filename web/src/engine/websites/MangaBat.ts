import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './MangaBat.webp';
import * as Common from './decorators/Common';
import * as MangaNelBase from './decorators/MangaNelBase';

@MangaNelBase.MangaCSS(/^https?:\/\/(h\.|read)?mangabat\.com\/read-[a-z]+\d+$/)
@Common.MangasMultiPageCSS('/manga-list-all/{page}', 'div.panel-list-story div.list-story-item h3 a.item-title', 1, 1, 0, MangaNelBase.AnchorInfoExtractor)
@Common.ChaptersSinglePageCSS(MangaNelBase.queryChapters, MangaNelBase.AnchorInfoExtractor)
@Common.PagesSinglePageCSS(MangaNelBase.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabat', `MangaBat`, 'https://h.mangabat.com', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}

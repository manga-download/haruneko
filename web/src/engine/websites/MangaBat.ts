import { Tags } from '../Tags';
import icon from './MangaBat.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaNel from './decorators/MangaNel';

@MangaNel.MangaCSS(/(h\.|read\.)?mangabat\.com/)
@MangaNel.MangasMultiPageCSS('/manga-list-all/{page}', 'div.panel-list-story div.list-story-item h3 a.item-title')
@MangaNel.ChaptersSinglePageCSS()
@MangaNel.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabat', `MangaBat`, 'https://h.mangabat.com', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}

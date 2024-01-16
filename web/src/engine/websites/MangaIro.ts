import { Tags } from '../Tags';
import icon from './MangaIro.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaNel from './decorators/MangaNel';

@MangaNel.MangaCSS(/(w\.|chap\.)?mangairo\.com/, 'ul.story_info_right li h1')
@MangaNel.MangasMultiPageCSS('/manga-list/type-latest/ctg-all/state-all/page-{page}', 'div.story-item h3.story-name a')
@MangaNel.ChaptersSinglePageCSS()
@MangaNel.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangairo', `Mangairo`, 'https://w.mangairo.com', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}

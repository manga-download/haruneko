import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangasSinglePageCSS('/mangas/', 'article.manga h2.entry-title a')
@Common.ChaptersSinglePageCSS('article.manga h2.entry-title a')
@Common.PagesSinglePageCSS('article.manga section.ft-entry img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scansmangas', 'ScansMangas', 'https://scans-mangas.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.French);
    }
}
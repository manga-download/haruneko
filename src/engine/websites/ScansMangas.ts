import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { MangasSinglePageCSS, ChaptersSinglePageCSS, PagesSinglePageCSS, ImageDirect } from './decorators/Common';

@MangasSinglePageCSS('/mangas/', 'article.manga h2.entry-title a')
@ChaptersSinglePageCSS('article.manga h2.entry-title a')
@PagesSinglePageCSS('article.manga section.ft-entry img')
@ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scansmangas', 'ScansMangas', 'https://scans-mangas.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.French);
    }
}
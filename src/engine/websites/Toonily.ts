import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { MangasMultiPageCSS, ChaptersSinglePageCSS, PagesSinglePageCSS } from './decorators/WordPressMadara';

@MangasMultiPageCSS()
@ChaptersSinglePageCSS()
@PagesSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonily', 'Toonily', 'https://toonily.com', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Erotica, Tags.Language.English);
    }
}
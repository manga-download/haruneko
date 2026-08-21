import { Tags } from '../Tags';
import icon from './Manhwa18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { ClipBoardExtractor, queryChapters, queryMangas } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'span.series-name', ClipBoardExtractor)
@Common.MangasMultiPageCSS(queryMangas, Common.PatternLinkGenerator('/manga-list?page={page}'))
@Common.ChaptersSinglePageCSS(queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#chapter-content img.lazy')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa18', 'Manhwa 18 (.com)', 'https://manhwa18.com', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
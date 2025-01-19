import { Tags } from '../Tags';
import icon from './KLManga.webp';
import * as Common from './decorators/Common';
import { ChapterScript, FlatManga, MangaExtractor, PageScript, pathSinglePageManga } from './templates/FlatManga';

@Common.MangasSinglePagesCSS([pathSinglePageManga], 'span[data-toggle="mangapop"] a', MangaExtractor)
@Common.ChaptersSinglePageJS(ChapterScript('a.chapter:not([href="#"])'), 1500)
@Common.PagesSinglePageJS(PageScript(), 1500)
export default class extends FlatManga {

    public constructor() {
        super('klmanga', 'KLManga', 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}